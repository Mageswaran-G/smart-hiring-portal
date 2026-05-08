import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Briefcase, Globe, Link2, Award, Languages, FolderGit2, ExternalLink } from 'lucide-react';

// Public profile page — no login required
// Accessible at /p/:slug

export default function PublicProfilePage() {
  const { slug } = useParams();

  const [profile,   setProfile]   = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound,  setNotFound]  = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/public/profile/${slug}`);
        const data = await res.json();
        if (!res.ok) { setNotFound(true); return; }
        setProfile(data.data);
      } catch {
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPublicProfile();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading profile...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center px-6">
        <div className="bg-white rounded-2xl p-10 shadow-md max-w-md w-full">
          <h2 className="font-sora font-bold text-gray-900 text-xl mb-2">Profile Not Found</h2>
          <p className="text-sm text-gray-400 mb-6">
            The profile you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/login"
            className="inline-block px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg no-underline hover:bg-gray-800 transition">
            Go to HirePortal
          </Link>
        </div>
      </div>
    );
  }

  const isCandidate = profile?.role === 'candidate';
  const accent      = isCandidate ? '#E65C00' : '#1D3557';

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="font-sora w-8 h-8 rounded-lg text-white flex items-center justify-center font-extrabold text-sm"
            style={{ background: accent }}>
            HP
          </span>
          <span className="font-sora font-bold text-gray-900 text-base">HirePortal</span>
        </div>
        <Link
          to="/login"
          className="text-xs font-semibold px-4 py-2 rounded-lg text-white no-underline"
          style={{ background: accent }}>
          Sign In
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-4">

        {/* Header card */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-start gap-4">

            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-3"
              style={{ border: `3px solid ${accent}` }}>
              {profile?.profilePhoto ? (
                <img
                  src={`${API_URL}${profile.profilePhoto}`}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="font-sora w-full h-full text-white text-3xl font-extrabold flex items-center justify-center"
                  style={{ background: accent }}>
                  {profile?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="font-sora text-2xl font-bold text-gray-900 mb-0.5">
                {profile?.name}
              </h1>

              {profile?.headline && (
                <p className="text-sm font-medium text-gray-600 mb-2">{profile.headline}</p>
              )}

              <div className="flex flex-wrap gap-3">
                {(profile?.city || profile?.country) && (
                  <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                    <MapPin size={12} />
                    {[profile.city, profile.country].filter(Boolean).join(', ')}
                  </span>
                )}
                {profile?.jobType && (
                  <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                    <Briefcase size={12} />
                    {profile.jobType}
                  </span>
                )}
              </div>

              <div className="flex gap-2 mt-3">
                {profile?.linkedIn && (
                  <a href={profile.linkedIn} target="_blank" rel="noreferrer"
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition no-underline">
                    <Link2 size={15} className="text-gray-500" />
                  </a>
                )}
                {profile?.github && (
                  <a href={profile.github} target="_blank" rel="noreferrer"
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition no-underline">
                    <ExternalLink size={15} className="text-gray-500" />
                  </a>
                )}
                {profile?.portfolio && (
                  <a href={profile.portfolio} target="_blank" rel="noreferrer"
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition no-underline">
                    <Globe size={15} className="text-gray-500" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        {profile?.bio && (
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="font-sora font-bold text-gray-900 mb-3">About</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* Skills */}
        {isCandidate && profile?.skills?.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="font-sora font-bold text-gray-900 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, i) => {
                const name = typeof skill === 'string' ? skill : skill.name;
                return (
                  <span key={i} className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                    {name}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Education */}
        {isCandidate && profile?.educationList?.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="font-sora font-bold text-gray-900 mb-4">Education</h2>
            <div className="flex flex-col gap-4">
              {profile.educationList.map((edu, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: accent }} />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                    </p>
                    <p className="text-xs text-gray-400">{edu.institution}</p>
                    <p className="text-xs text-gray-300 mt-0.5">
                      {edu.startYear} — {edu.current ? 'Present' : edu.endYear}
                      {edu.grade ? ` · ${edu.grade}` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Work History */}
        {isCandidate && profile?.workHistory?.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="font-sora font-bold text-gray-900 mb-4">Work Experience</h2>
            <div className="flex flex-col gap-4">
              {profile.workHistory.map((work, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: accent }} />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{work.role}</p>
                    <p className="text-xs text-gray-400">{work.company}{work.type ? ` · ${work.type}` : ''}</p>
                    <p className="text-xs text-gray-300 mt-0.5">
                      {work.startDate} — {work.current ? 'Present' : work.endDate}
                    </p>
                    {work.description && (
                      <p className="text-xs text-gray-500 mt-1">{work.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio */}
        {isCandidate && profile?.portfolioProjects?.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="font-sora font-bold text-gray-900 mb-4">Portfolio Projects</h2>
            <div className="flex flex-col gap-3">
              {profile.portfolioProjects.map((project, i) => (
                <div key={i} className="p-4 border border-gray-100 rounded-xl">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <FolderGit2 size={14} className="text-gray-400" />
                      <p className="text-sm font-semibold text-gray-800">{project.title}</p>
                    </div>
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noreferrer"
                        className="text-xs font-medium no-underline flex items-center gap-1"
                        style={{ color: accent }}>
                        View
                      </a>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-xs text-gray-500 mb-2 pl-5">{project.description}</p>
                  )}
                  {project.tech && (
                    <div className="flex flex-wrap gap-1.5 pl-5">
                      {project.tech.split(',').map(t => t.trim()).filter(Boolean).map((tech, j) => (
                        <span key={j} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {profile?.certifications?.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="font-sora font-bold text-gray-900 mb-4">Certifications</h2>
            <div className="flex flex-col gap-3">
              {profile.certifications.map((cert, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Award size={16} className="text-gray-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{cert.name}</p>
                    <p className="text-xs text-gray-400">{cert.issuer}{cert.year ? ` · ${cert.year}` : ''}</p>
                  </div>
                  {cert.url && (
                    <a href={cert.url} target="_blank" rel="noreferrer"
                      className="text-xs font-medium no-underline"
                      style={{ color: accent }}>
                      View
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {profile?.languages?.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="font-sora font-bold text-gray-900 mb-4">Languages</h2>
            <div className="flex flex-wrap gap-2">
              {profile.languages.map((lang, i) => (
                <span key={i} className="text-sm px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-full font-medium capitalize">
                  {lang.language}
                  {lang.proficiency && (
                    <span className="text-xs text-gray-400 ml-1">· {lang.proficiency}</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-300">
            Profile powered by{' '}
            <span className="font-semibold" style={{ color: accent }}>HirePortal</span>
          </p>
        </div>

      </div>
    </div>
  );
}
