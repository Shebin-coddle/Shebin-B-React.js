import { useEffect, useState } from "react";
import DataTable from "../../components/table/DataTable";
import DetailCard from "../../components/DetailsView";
import { getMedicalRecordsByPatientId } from "../../services/MedicalRecordService";
import type { MedicalRecord } from "../../types/MedicalRecordTypes";

function PatientMedicalRecords() {
  const patientId = Number(localStorage.getItem("user_id"));
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchMedicalRecords() {
      try {
        const records = await getMedicalRecordsByPatientId(patientId);
        setMedicalRecords(records);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error occurred while fetching medical records");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchMedicalRecords();
  }, [patientId]);

  function handleView(id: number) {
    const record = medicalRecords.find((record) => record.id === id);

    if (record) {
      setSelectedRecord(record);
    }
  }

  const columns = [
    {
      header: "Diagnosis",
      render: (record: MedicalRecord) => record.medical_condition,
    },
    {
      header: "Treatment",
      render: (record: MedicalRecord) => record.treatment,
    },
    {
      header: "Status",
      render: (record: MedicalRecord) => record.status,
    },
    {
      header: "Date",
      render: (record: MedicalRecord) =>
        new Date(record.diagnosis_date).toLocaleDateString("en-IN"),
    },
    {
      header: "Actions",
      render: (record: MedicalRecord) => (
        <div className="table-actions">
          <button onClick={() => handleView(record.id)}>View</button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <p>Loading medical records...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <section>
      <h2>My Medical Records</h2>

      <DataTable columns={columns} data={medicalRecords} />

      {selectedRecord && (
        <DetailCard
          title="Selected Medical Record"
          details={[
            {
              label: "Diagnosis",
              value: selectedRecord.medical_condition,
            },
            {
              label: "Treatment",
              value: selectedRecord.treatment,
            },
            {
              label: "Status",
              value: selectedRecord.status,
            },
            {
              label: "Date",
              value: selectedRecord.diagnosis_date,
            },
          ]}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </section>
  );
}

export default PatientMedicalRecords;
