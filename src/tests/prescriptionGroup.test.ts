import { describe, it, expect, vi } from "vitest";
const { groupPrescriptions } = await vi.importActual<typeof import("../utils/prescriptionGroup")>("../utils/prescriptionGroup");

describe("prescriptionGroup - groupPrescriptions", () => {
  it("should aggregate multiple SQL join rows into a grouped prescription array format", () => {
    const mockRows = [
      {
        prescription_id: 1,
        patient_id: 10,
        doctor_id: 20,
        item_id: 101,
        medicine_id: 5,
        dosage: "1-0-1",
        start_date: "2026-06-25",
        end_date: "2026-06-30",
      },
      {
        prescription_id: 1,
        patient_id: 10,
        doctor_id: 20,
        item_id: 102,
        medicine_id: 8,
        dosage: "0-0-1",
        start_date: "2026-06-25",
        end_date: "2026-07-05",
      },
      {
        prescription_id: 2,
        patient_id: 11,
        doctor_id: 20,
        item_id: 103,
        medicine_id: 12,
        dosage: "1-1-1",
        start_date: "2026-06-26",
        end_date: "2026-06-28",
      },
    ];

    const result = groupPrescriptions(mockRows as any);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: 1,
      patient_id: 10,
      doctor_id: 20,
      items: [
        { id: 101, medicine_id: 5, dosage: "1-0-1", start_date: "2026-06-25", end_date: "2026-06-30" },
        { id: 102, medicine_id: 8, dosage: "0-0-1", start_date: "2026-06-25", end_date: "2026-07-05" },
      ],
    });
    expect(result[1]).toEqual({
      id: 2,
      patient_id: 11,
      doctor_id: 20,
      items: [
        { id: 103, medicine_id: 12, dosage: "1-1-1", start_date: "2026-06-26", end_date: "2026-06-28" },
      ],
    });
  });

  it("should initialize structure but leave items collection empty if item_id is null", () => {
    const mockRows = [
      {
        prescription_id: 3,
        patient_id: 15,
        doctor_id: 25,
        item_id: null,
        medicine_id: null,
        dosage: null,
        start_date: null,
        end_date: null,
      },
    ];

    const result = groupPrescriptions(mockRows as any);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: 3,
      patient_id: 15,
      doctor_id: 25,
      items: [],
    });
  });
});