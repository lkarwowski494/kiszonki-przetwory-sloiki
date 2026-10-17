#!/usr/bin/env python3
"""
scripts/gen-brine-corpus.py
Generates independent truth oracle corpus for brine calculation and USDA pasteurization safety (BR-TEST-011..013).
"""

import json
import math
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path

def round_half_up(val: float, decimals: int = 1) -> float:
    d = Decimal(str(round(val, 6)))
    target = Decimal('1') if decimals == 0 else Decimal('10') ** -decimals
    return float(d.quantize(target, rounding=ROUND_HALF_UP))

def calculate_brine_oracle(produce_g: float, water_g: float, salinity_pct: float, method: str):
    if salinity_pct <= 0 or salinity_pct > 20:
        raise ValueError("Invalid salinity")
    if produce_g < 0 or water_g < 0:
        raise ValueError("Negative mass")

    if method == "dry_salting":
        salt = (salinity_pct / (100.0 - salinity_pct)) * produce_g
        rounded_salt = round_half_up(salt, 1)
        total_mass = int(round_half_up(produce_g + rounded_salt, 0))
        return {
            "produce_g": produce_g,
            "water_g": 0,
            "target_pct": salinity_pct,
            "method": method,
            "salt_g": rounded_salt,
            "total_mass_g": total_mass,
            "effective_pct": salinity_pct
        }

    if method == "total_mass":
        base_mass = produce_g + water_g
        salt = (salinity_pct / (100.0 - salinity_pct)) * base_mass
        rounded_salt = round_half_up(salt, 1)
        total_mass = int(round_half_up(base_mass + rounded_salt, 0))
        cacl2 = round_half_up(total_mass * 0.0008, 1)
        return {
            "produce_g": produce_g,
            "water_g": water_g,
            "target_pct": salinity_pct,
            "method": method,
            "salt_g": rounded_salt,
            "total_mass_g": total_mass,
            "effective_pct": salinity_pct,
            "cacl2_g": cacl2 if cacl2 > 0 else None
        }

    # water_only
    salt = (salinity_pct / 100.0) * water_g
    rounded_salt = round_half_up(salt, 1)
    total_base = produce_g + water_g
    actual_effective = round_half_up((rounded_salt / total_base) * 100.0, 1) if total_base > 0 else salinity_pct
    return {
        "produce_g": produce_g,
        "water_g": water_g,
        "target_pct": salinity_pct,
        "method": method,
        "salt_g": rounded_salt,
        "total_mass_g": int(round_half_up(total_base + rounded_salt, 0)),
        "effective_pct": actual_effective
    }


def evaluate_pasteurization_oracle(food_ph: float, jar_volume_ml: int, method: str):
    botulism_ph_critical = 4.60
    if food_ph >= botulism_ph_critical:
        if method in ("water_bath", "oven"):
            return {
                "food_ph": food_ph,
                "jar_volume_ml": jar_volume_ml,
                "method": method,
                "is_safe_for_water_bath": False,
                "requires_pressure_canning": True,
                "target_minutes": 0,
                "temperature_celsius": 100
            }
        if method == "tyndallization":
            return {
                "food_ph": food_ph,
                "jar_volume_ml": jar_volume_ml,
                "method": method,
                "is_safe_for_water_bath": True,
                "requires_pressure_canning": False,
                "target_minutes": 60,
                "temperature_celsius": 100
            }

    if jar_volume_ml <= 350:
        base_min = 10
    elif jar_volume_ml <= 550:
        base_min = 15
    elif jar_volume_ml <= 1000:
        base_min = 20
    else:
        base_min = 30

    if method == "oven":
        return {
            "food_ph": food_ph,
            "jar_volume_ml": jar_volume_ml,
            "method": method,
            "is_safe_for_water_bath": True,
            "requires_pressure_canning": False,
            "target_minutes": base_min + 15,
            "temperature_celsius": 120
        }
    if method == "sous_vide":
        return {
            "food_ph": food_ph,
            "jar_volume_ml": jar_volume_ml,
            "method": method,
            "is_safe_for_water_bath": True,
            "requires_pressure_canning": False,
            "target_minutes": base_min * 2,
            "temperature_celsius": 85
        }
    return {
        "food_ph": food_ph,
        "jar_volume_ml": jar_volume_ml,
        "method": method,
        "is_safe_for_water_bath": True,
        "requires_pressure_canning": False,
        "target_minutes": base_min,
        "temperature_celsius": 100
    }

def main():
    fixtures_dir = Path(__file__).resolve().parent.parent / "tests" / "fixtures"
    fixtures_dir.mkdir(parents=True, exist_ok=True)

    brine_cases = []
    produce_grid = [100, 500, 1000, 1500, 2000]
    water_grid = [200, 500, 1000, 1500]
    salinity_grid = [1.5, 2.0, 2.5, 3.0, 3.5, 5.0]

    for p in produce_grid:
        for sal in salinity_grid:
            brine_cases.append(calculate_brine_oracle(p, 0, sal, "dry_salting"))

    for p in produce_grid:
        for w in water_grid:
            for sal in salinity_grid:
                brine_cases.append(calculate_brine_oracle(p, w, sal, "total_mass"))
                brine_cases.append(calculate_brine_oracle(p, w, sal, "water_only"))

    pasteur_cases = []
    ph_grid = [3.5, 4.0, 4.2, 4.5, 4.6, 5.0, 6.0]
    vol_grid = [330, 500, 720, 900, 1500]
    methods = ["water_bath", "oven", "sous_vide", "tyndallization"]

    for ph in ph_grid:
        for vol in vol_grid:
            for m in methods:
                pasteur_cases.append(evaluate_pasteurization_oracle(ph, vol, m))

    output = {
        "version": "1.0.0",
        "generated_by": "scripts/gen-brine-corpus.py",
        "brine_cases_count": len(brine_cases),
        "pasteur_cases_count": len(pasteur_cases),
        "brine_cases": brine_cases,
        "pasteur_cases": pasteur_cases
    }

    out_file = fixtures_dir / "brine-oracle-corpus.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"[gen-brine-corpus] Wygenerowano {len(brine_cases)} solanek i {len(pasteur_cases)} pasteryzacji -> {out_file}")

if __name__ == "__main__":
    main()
