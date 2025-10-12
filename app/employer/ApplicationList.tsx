import React from 'react'

interface ApplicationListProps {
  applications: {
    id: number;
    status: string;
    extractedName: string | null;
    extractedEmail: string | null;
    extractedPhone: string | null;
    extractedSkills: string | null;
    score: number | null;
    job: { title: string };
    candidate: {
      id: number;
      name: string | null;
      email: string;
      mobileNumber: string | null;
    } | null;
  }[]
}

export default function ApplicationList({ applications }: ApplicationListProps) {

  const updateApplicationStatus = async (applicationId: number, newStatus: 'PENDING' | 'VIEWED' | 'ACCEPTED' | 'REJECTED') => {
    try {
      const response = await fetch('/api/application/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ applicationId, newStatus }),
      });

      if (!response.ok) {
        throw new Error(`Error updating application status: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Application status updated:', data.application);
      // Optionally, you might want to refresh the applications list here
    } catch (error) {
      console.error('Failed to update application status:', error);
    }
  };

  const handleViewDetails = (applicationId: number) => {
    console.log(`View details for application ${applicationId}`);
    updateApplicationStatus(applicationId, 'VIEWED');
    // TODO: Add logic to display application details (e.g., open a modal or navigate to a new page)
  };

  const handleDownloadCV = (applicationId: number) => {
    console.log(`Download CV for application ${applicationId}`);
    // updateApplicationStatus(applicationId, 'CV downloaded'); // This status is not in the enum
    // TODO: Add logic to actually download the CV
  };

  return (
    <>
      {applications.length === 0 ? (
        <p className="text-muted-foreground">No applications yet.</p>
      ) : (
        <ul className="space-y-3">
          {applications.map(app => (
            <li key={app.id} className="bg-card p-4 rounded border border-border glass-dark">
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold text-foreground">{app.job?.title}</div>
                  <div className="text-sm text-muted-foreground">Status: {app.status}</div>
                  <div className="mt-2">
                    <h4 className="font-medium text-foreground">Candidate Profile:</h4>
                    <p className="text-foreground"><strong>Name:</strong> {app.extractedName || app.candidate?.name || 'N/A'}</p>
                    <p className="text-foreground"><strong>Email:</strong> {app.extractedEmail || app.candidate?.email || 'N/A'}</p>
                    <p className="text-foreground"><strong>Phone:</strong> {app.extractedPhone || app.candidate?.mobileNumber || 'N/A'}</p>
                    <p className="text-foreground"><strong>Skills:</strong> {app.extractedSkills || 'N/A'}</p>
                    <p className="text-foreground"><strong>Score:</strong> {app.score !== null ? app.score : 'N/A'}</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded transition"
                    onClick={() => handleViewDetails(app.id)}
                  >
                    View Details
                  </button>
                  <button
                    className="secondaryButton-dark font-bold py-2 px-4 rounded transition"
                    onClick={() => handleDownloadCV(app.id)}
                  >
                    Download CV
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
