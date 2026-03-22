import React, { useState, useEffect } from "react";
import Badge from "../../common/Badge";
import Button from "../../common/Button";
import { PageSpinner } from "../../common/Spinner";
import DocumentViewerModal from "../../common/DocumentViewerModal";
import * as accountService from "../../../services/accountService";

// ─── Applicant Detail View ─────────────────────────────────────
const ApplicantDetailView = ({ applicant, onBack }) => {
  const [detailedData, setDetailedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await accountService.getApplicantDetails(applicant.id);
        setDetailedData(data);
      } catch (err) {
        console.error('Error fetching applicant details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [applicant.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PageSpinner />
      </div>
    );
  }

  if (error || !detailedData) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Details</h2>
          <p className="text-gray-500 mb-6">{error || 'Failed to load applicant details'}</p>
          <Button variant="secondary" onClick={onBack}>← Back to Applicants</Button>
        </div>
      </div>
    );
  }

  const user = detailedData.user;
  const application = detailedData.applications?.[0];

  const statusVariantMap = {
    pending: "warning",
    approved: "success",
    rejected: "danger",
  };

  const statusKey = (application?.status || "pending").toLowerCase();
  const badgeVariant = statusVariantMap[statusKey] ?? "default";
  const statusLabel = application?.status
    ? application.status.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
    : "Pending";

  const dateApplied = application?.submittedAt
    ? new Date(application.submittedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-primary">{user.firstName?.[0]}{user.lastName?.[0]}</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{user.firstName} {user.lastName}</h1>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={badgeVariant} label={statusLabel} />
            {dateApplied && (
              <span className="text-sm text-gray-600">Applied: {dateApplied}</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Personal Information Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">First Name</label>
              <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">{user.firstName || "—"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Middle Name</label>
              <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">{user.middleName || "—"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Last Name</label>
              <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">{user.lastName || "—"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Suffix</label>
              <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">{user.suffix || "—"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Gender</label>
              <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">{user.gender || "—"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Date of Birth</label>
              <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">
                {user.birthday ? new Date(user.birthday).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Civil Status</label>
              <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">{user.civilStatus || "—"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Citizenship</label>
              <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">{user.citizenship || "—"}</p>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Contact Information</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">{user.email || "—"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Mobile Number</label>
              <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">{user.mobileNumber || "—"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Facebook</label>
              <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">{user.facebook || "—"}</p>
            </div>
          </div>
        </div>

        {/* Address Information Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Address Information</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Street</label>
              <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">{user.street || "—"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Barangay</label>
              <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">{user.barangay || "—"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">City</label>
              <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">{user.city || "—"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Province</label>
              <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">{user.province || "—"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Country</label>
              <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">{user.country || "—"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Zip Code</label>
              <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">{user.zipCode || "—"}</p>
            </div>
          </div>
        </div>

        {/* Application Information Section */}
        {application && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Application Information</h2>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Scholarship Type</label>
                <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">{application.scholarship?.title || "—"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded capitalize">{application.status || "—"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Submitted Date</label>
                <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">
                  {application.submittedAt ? new Date(application.submittedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"}
                </p>
              </div>
              {application.reviewedAt && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Reviewed Date</label>
                    <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">
                      {new Date(application.reviewedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                  {application.reviewedBy && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Reviewed By</label>
                      <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">
                        {application.reviewedBy.firstName} {application.reviewedBy.lastName}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
            {application.notes && (
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-600">Notes</label>
                <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">{application.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Family Members Section */}
        {application?.familyMembers && application.familyMembers.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Family Members</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Full Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Relationship</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Age</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Occupation</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Monthly Income</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {application.familyMembers.map((member, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{member.fullName || "—"}</td>
                      <td className="px-4 py-3">{member.relationship || "—"}</td>
                      <td className="px-4 py-3">{member.age || "—"}</td>
                      <td className="px-4 py-3">{member.occupation || "—"}</td>
                      <td className="px-4 py-3">₱ {member.monthlyIncome ? parseFloat(member.monthlyIncome).toLocaleString() : "—"}</td>
                      <td className="px-4 py-3 capitalize">{member.status || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tertiary Application Details */}
        {application?.typeSpecificData?.type === 'tertiary' && application.typeSpecificData.details && (
          <>
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Tertiary Scholarship Details</h2>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">School Name</label>
                  <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">{application.typeSpecificData.details.schoolName || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Course</label>
                  <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">{application.typeSpecificData.details.course || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Year Level</label>
                  <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">{application.typeSpecificData.details.yearLevel || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">GPA</label>
                  <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">{application.typeSpecificData.details.gpa || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Tuition Fee</label>
                  <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">₱ {application.typeSpecificData.details.tuitionFee ? parseFloat(application.typeSpecificData.details.tuitionFee).toLocaleString() : "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Miscellaneous Fee</label>
                  <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">₱ {application.typeSpecificData.details.miscellaneousFee ? parseFloat(application.typeSpecificData.details.miscellaneousFee).toLocaleString() : "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Incoming Freshman</label>
                  <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">{application.typeSpecificData.details.incomingFreshman ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>

            {application.typeSpecificData.education && application.typeSpecificData.education.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Previous Education</h2>
                <div className="space-y-4">
                  {application.typeSpecificData.education.map((edu, idx) => (
                    <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <label className="text-xs font-medium text-gray-600">School</label>
                          <p className="text-sm text-gray-900 mt-1">{edu.schoolName || "—"}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600">Level</label>
                          <p className="text-sm text-gray-900 mt-1">{edu.level || "—"}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600">Year Completed</label>
                          <p className="text-sm text-gray-900 mt-1">{edu.yearCompleted || "—"}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600">General Average</label>
                          <p className="text-sm text-gray-900 mt-1">{edu.generalAverage || "—"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Vocational Application Details */}
        {application?.typeSpecificData?.type === 'vocational' && application.typeSpecificData.details && (
          <>
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Vocational Scholarship Details</h2>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Program Name</label>
                  <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">{application.typeSpecificData.details.programName || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Training Center</label>
                  <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">{application.typeSpecificData.details.trainingCenter || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Duration</label>
                  <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">{application.typeSpecificData.details.duration || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Start Date</label>
                  <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">
                    {application.typeSpecificData.details.startDate ? new Date(application.typeSpecificData.details.startDate).toLocaleDateString() : "—"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">End Date</label>
                  <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">
                    {application.typeSpecificData.details.endDate ? new Date(application.typeSpecificData.details.endDate).toLocaleDateString() : "—"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Training Cost</label>
                  <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded">₱ {application.typeSpecificData.details.trainingCost ? parseFloat(application.typeSpecificData.details.trainingCost).toLocaleString() : "—"}</p>
                </div>
              </div>
            </div>

            {application.typeSpecificData.education && application.typeSpecificData.education.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Related Courses & Training</h2>
                <div className="space-y-4">
                  {application.typeSpecificData.education.map((edu, idx) => (
                    <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs font-medium text-gray-600">Course Name</label>
                          <p className="text-sm text-gray-900 mt-1">{edu.courseName || "—"}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600">Provider</label>
                          <p className="text-sm text-gray-900 mt-1">{edu.provider || "—"}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600">Completion Date</label>
                          <p className="text-sm text-gray-900 mt-1">
                            {edu.completionDate ? new Date(edu.completionDate).toLocaleDateString() : "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Application Documents Section - Updated */}
        {application?.documents && application.documents.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Application Documents</h2>
            <div className="grid grid-cols-2 gap-4">
              {application.documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-gray-200 rounded-lg flex items-center justify-between hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900 capitalize">{doc.documentType?.replace(/_/g, ' ') || `Document ${idx + 1}`}</p>
                    <p className="text-xs text-gray-500 mt-1 truncate max-w-[200px]" title={doc.fileName}>{doc.fileName}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">{doc.fileSize ? `${(doc.fileSize / 1024).toFixed(2)} KB` : "—"}</span>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs text-green-600 font-medium">{doc.isRequired ? "Required" : "Optional"}</span>
                    </div>
                  </div>
                  {(doc.fileUrl || doc.filePath) && (
                    <button
                      onClick={() => setSelectedDocument(doc)}
                      className="ml-4 p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                      title="View document"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}



        {/* Action Buttons */}
        <div className="flex gap-3 mb-8">
          <Button
            variant="secondary"
            onClick={onBack}
          >
            ← Back to Applicants
          </Button>
          <Button
            variant="secondary"
            onClick={() => console.log("Request documents")}
          >
            📧 Request Documents
          </Button>
          <Button
            variant="danger"
            onClick={() => console.log("Reject")}
          >
            Reject
          </Button>
          <Button
            variant="primary"
            onClick={() => console.log("Approve")}
          >
            Approve
          </Button>
        </div>
      </div>

      <DocumentViewerModal
        isOpen={!!selectedDocument}
        onClose={() => setSelectedDocument(null)}
        documentUrl={selectedDocument?.fileUrl || selectedDocument?.filePath}
        fileName={selectedDocument?.fileName || 'Document'}
        documentType={selectedDocument?.documentType}
        mimeType={selectedDocument?.mimeType}
      />
    </div>
  );
};

export default ApplicantDetailView;
