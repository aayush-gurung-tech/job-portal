const postform = document.querySelector(".post-form");
const jobtitle = document.querySelector(".job-title");
const company = document.querySelector(".company");
const locationInput = document.querySelector(".location");
const jobtype = document.querySelector(".job-type");
const salaryrange = document.querySelector(".salary-range");
const experiencelevel = document.querySelector(".experience-level");
const jobdescription = document.querySelector(".job-description");
const requirements = document.querySelector(".requirements");
const savedraft = document.querySelector(".save-draft");
const postmessage = document.querySelector("[data-post-message]");
const jobgrid = document.querySelector(".job-grid");
const myjobstable = document.querySelector("[data-my-jobs-body]");
const savedjobslist = document.querySelector("[data-saved-jobs-list]");
const appliedjobsbody = document.querySelector("[data-applied-jobs-body]");
const myappliersbody = document.querySelector("[data-my-appliers-body]");
const searchform = document.querySelector(".search-panel");
const searchinput = document.querySelector(".search-input");
const locationfilter = document.querySelector("#location");
const postedfilter = document.querySelector("#posted");
const clearfilters = document.querySelector("[data-clear-filters]");
const POST_DRAFT_KEY = "postJobDraft";
const POST_JOBS_KEY = "postedJobs";
const POST_SAVED_KEY = "savedJobs";
const POST_APPLIED_KEY = "appliedJobs";
const POST_AUTH_KEY = "authUserEmail";

const defaultJobs = [
  {
    id: "frontend",
    myjobtitle: "Frontend Developer",
    mycompany: "Arbeitnow Analytics",
    mylocation: "Kathmandu, Nepal",
    myjobtype: "Remote",
    mysalaryrange: "$90k - $120k",
    myexperiencelevel: "Mid",
    myjobdescription: "Build clean React interfaces for hiring dashboards and candidate workflows.",
    myrequirements: "HTML, CSS, JavaScript, and frontend project experience.",
    postedAt: "May 6, 2026",
    createdAt: "2026-05-06T00:00:00.000Z",
    status: "open"
  },
  {
    id: "designer",
    myjobtitle: "UI/UX Designer",
    mycompany: "Nimbus Studio",
    mylocation: "Pokhara, Nepal",
    myjobtype: "Full-Time",
    mysalaryrange: "$45k - $70k",
    myexperiencelevel: "Junior",
    myjobdescription: "Design simple product screens, improve flows, and work closely with developers.",
    myrequirements: "Figma skill, portfolio, and basic UX knowledge.",
    postedAt: "Apr 28, 2026",
    createdAt: "2026-04-28T00:00:00.000Z",
    status: "open"
  },
  {
    id: "backend",
    myjobtitle: "Backend Engineer",
    mycompany: "TechBridge Labs",
    mylocation: "Lalitpur, Nepal",
    myjobtype: "Hybrid",
    mysalaryrange: "$70k - $100k",
    myexperiencelevel: "Mid",
    myjobdescription: "Own APIs, database design, and reliable services for a growing job platform.",
    myrequirements: "Backend APIs, database knowledge, and service reliability experience.",
    postedAt: "Apr 30, 2026",
    createdAt: "2026-04-30T00:00:00.000Z",
    status: "open"
  }
];

function showMessage(message) {
  if (postmessage) {
    postmessage.textContent = message;
  }
}

function cleanText(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getdata() {
  if (
    !jobtitle ||
    !company ||
    !locationInput ||
    !jobtype ||
    !salaryrange ||
    !experiencelevel ||
    !jobdescription ||
    !requirements
  ) {
    return null;
  }

  return {
    myjobtitle: jobtitle.value.trim(),
    mycompany: company.value.trim(),
    mylocation: locationInput.value.trim(),
    myjobtype: jobtype.value.trim(),
    mysalaryrange: salaryrange.value.trim(),
    myexperiencelevel: experiencelevel.value.trim(),
    myjobdescription: jobdescription.value.trim(),
    myrequirements: requirements.value.trim()
  };
}

function fillForm(data) {
  if (!data || !postform) return;

  jobtitle.value = data.myjobtitle || "";
  company.value = data.mycompany || "";
  locationInput.value = data.mylocation || "";
  jobtype.value = data.myjobtype || "Full-Time";
  salaryrange.value = data.mysalaryrange || "";
  experiencelevel.value = data.myexperiencelevel || "Junior";
  jobdescription.value = data.myjobdescription || "";
  requirements.value = data.myrequirements || "";
}

function validateRequired(data) {
  return data.myjobtitle && data.mycompany && data.mylocation && data.myjobdescription;
}

function getPostedJobs() {
  try {
    return JSON.parse(localStorage.getItem(POST_JOBS_KEY)) || [];
  } catch (error) {
    localStorage.removeItem(POST_JOBS_KEY);
    return [];
  }
}

function getSavedJobs() {
  try {
    return JSON.parse(localStorage.getItem(POST_SAVED_KEY)) || [];
  } catch (error) {
    localStorage.removeItem(POST_SAVED_KEY);
    return [];
  }
}

function getAppliedJobs() {
  try {
    return JSON.parse(localStorage.getItem(POST_APPLIED_KEY)) || [];
  } catch (error) {
    localStorage.removeItem(POST_APPLIED_KEY);
    return [];
  }
}

function setSavedJobs(jobs) {
  localStorage.setItem(POST_SAVED_KEY, JSON.stringify(jobs));
}

function setAppliedJobs(jobs) {
  localStorage.setItem(POST_APPLIED_KEY, JSON.stringify(jobs));
}

function isDashboardPage() {
  return document.body.dataset.page === "dashboard-findjobs";
}

function isLoggedIn() {
  return Boolean(sessionStorage.getItem(POST_AUTH_KEY));
}

function goToLogin() {
  window.location.href = "login.html";
}

function getCurrentUserEmail() {
  return sessionStorage.getItem(POST_AUTH_KEY) || "";
}

function normalizeJob(data) {
  return {
    id: data.id || `${data.myjobtitle}-${data.mycompany}`.toLowerCase().replace(/\s+/g, "-"),
    ownerEmail: data.ownerEmail || "",
    myjobtitle: data.myjobtitle || "",
    mycompany: data.mycompany || "",
    mylocation: data.mylocation || "",
    myjobtype: data.myjobtype || "",
    mysalaryrange: data.mysalaryrange || "",
    myexperiencelevel: data.myexperiencelevel || "Junior",
    myjobdescription: data.myjobdescription || "",
    myrequirements: data.myrequirements || "",
    postedAt: data.postedAt || "Today",
    createdAt: data.createdAt || new Date().toISOString(),
    status: data.status || "open",
    source: data.source || "JobPortal",
    externalUrl: data.externalUrl || "",
    isExternal: Boolean(data.externalUrl || data.isExternal)
  };
}

function savePostedJob(data) {
  const jobs = getPostedJobs();
  const ownerEmail = getCurrentUserEmail();
  const newJob = {
    ...data,
    id: Date.now(),
    ownerEmail,
    status: "open",
    createdAt: new Date().toISOString(),
    postedAt: new Date().toLocaleDateString("en", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  };

  jobs.unshift(newJob);
  localStorage.setItem(POST_JOBS_KEY, JSON.stringify(jobs));
}

function jobCardTemplate(data, index) {
  data = normalizeJob(data);
  const companyName = cleanText(data.mycompany);
  const firstLetter = companyName.charAt(0).toUpperCase() || "J";
  const salary = data.mysalaryrange ? `<span>${cleanText(data.mysalaryrange)}</span>` : "";
  const source = data.source ? `<span>${cleanText(data.source)}</span>` : "";
  const newBadge = isNewJob(data.createdAt) ? `<span class="job-new-badge">New</span>` : "";
  const techBadges = (data.technologies || []).slice(0, 3).map((tech) =>
    `<span>${cleanText(tech)}</span>`
  ).join("");
  const detailAction = data.externalUrl
    ? `<a href="${cleanText(data.externalUrl)}" class="btn btn-outline" target="_blank" rel="noopener">View Job</a>`
    : isDashboardPage()
    ? `<button class="btn btn-outline" type="button" data-open-job="${cleanText(data.id)}">View Details</button>`
    : `<a href="details.html" class="btn btn-outline">View Details</a>`;
  const applyAction = data.externalUrl
    ? `<a href="${cleanText(data.externalUrl)}" class="btn btn-outline" target="_blank" rel="noopener">Apply on Source</a>`
    : `<button class="btn btn-outline apply-job-btn" type="button">Apply Now</button>`;

  return `
    <article class="job-card" data-job-id="${cleanText(data.id)}" data-location="${cleanText(data.mylocation)}" data-job-type="${cleanText(data.myjobtype)}" data-created-at="${cleanText(data.createdAt)}" style="--delay: ${0.1 + index * 0.1}s">
        <div class="card-header">
            <div class="company-logo logo-green">${firstLetter}</div>
            <div>
                <h4>${cleanText(data.myjobtitle)}</h4>
                <p class="company-name">${companyName}</p>
            </div>
        </div>
        <div class="job-meta">
            <span>${cleanText(data.myjobtype)}</span>
            <span>${cleanText(data.mylocation)}</span>
            ${salary}
            ${source}
            ${newBadge}
            ${techBadges}
        </div>
        <p class="job-desc">${cleanText(data.myjobdescription)}</p>
        <div class="card-footer">
            ${detailAction}
            <button class="btn btn-success save-job-btn" type="button">Save Job</button>
            ${applyAction}
        </div>
    </article>
  `;
}

function myJobRowTemplate(data) {
  const postedDate = data.postedAt || "Today";
  const openTime = getOpenTime(data);
  const status = data.status === "closed" ? "closed" : "open";
  const statusText = status === "closed" ? "Closed" : "Open";
  const actionClass = status === "closed" ? "reopen" : "close";
  const actionText = status === "closed" ? "Reopen" : "Close";

  return `
    <tr data-job-id="${cleanText(data.id)}">
        <td>
            <strong>${cleanText(data.myjobtitle)}</strong>
            <p class="muted" style="margin: 4px 0 0;">${cleanText(data.mycompany)}</p>
        </td>
        <td>${cleanText(data.mylocation)}</td>
        <td>
            ${cleanText(postedDate)}
            <p class="muted" style="margin: 4px 0 0;">${cleanText(openTime)}</p>
        </td>
        <td><span class="status ${status}">${statusText}</span></td>
        <td>
            <div class="item-actions">
                <button class="btn btn-outline edit" type="button" data-action-message="Edit mode opened for this job.">Edit</button>
                <button class="btn btn-ghost ${actionClass}" type="button">${actionText}</button>
            </div>
        </td>
    </tr>
  `;
}

function savedJobTemplate(data) {
  data = normalizeJob(data);
  return `
    <article class="item-card" data-job-id="${cleanText(data.id)}">
        <div>
            <h4>${cleanText(data.myjobtitle)}</h4>
            <div class="item-meta">
                <span>${cleanText(data.mycompany)}</span>
                <span>-</span>
                <span>${cleanText(data.mylocation)}</span>
                <span>-</span>
                <span>${cleanText(data.mysalaryrange || "Negotiable")}</span>
            </div>
        </div>
        <div class="item-actions">
            <button class="btn btn-outline" type="button" data-open-job="${cleanText(data.id)}">View</button>
            <button class="btn btn-emerald apply-saved-btn" type="button">Apply Now</button>
            <button class="btn btn-ghost" type="button" data-remove-saved>Remove</button>
        </div>
    </article>
  `;
}

function appliedJobRowTemplate(data) {
  const job = normalizeJob(data);
  const applicationId = data.applicationId || job.id;

  return `
    <tr data-job-id="${cleanText(job.id)}" data-application-id="${cleanText(applicationId)}">
        <td>
            <strong>${cleanText(job.myjobtitle)}</strong>
            <p class="muted" style="margin: 4px 0 0;">${cleanText(job.mycompany)}</p>
        </td>
        <td>${cleanText(job.mylocation)}</td>
        <td>${cleanText(data.appliedAt || "Today")}</td>
        <td><span class="status review">${cleanText(data.applicationStatus || "In Review")}</span></td>
        <td>
            <div class="item-actions">
                <button class="btn btn-outline" type="button" data-open-job="${cleanText(job.id)}">View</button>
                <button class="btn btn-ghost" type="button" data-remove-applied>Withdraw</button>
            </div>
        </td>
    </tr>
  `;
}

function myApplierRowTemplate(data) {
  const job = normalizeJob(data);
  const applicant = data.applicant || {};
  const applicationId = data.applicationId || job.id;
  const applicantName = applicant.name || "Applicant";
  const applicantEmail = applicant.email || "No email";
  const applicantPhone = applicant.phone || "No phone added";
  const applicantProfession = applicant.profession || "Professional";
  const applicantLocation = applicant.location || "Location not added";
  const applicantExperience = applicant.experience || "Experience not added";
  const applicantSkills = applicant.skills || "Skills not added";
  const cvButton = applicant.cvData
    ? `<button class="btn btn-outline" type="button" data-view-cv="${cleanText(applicationId)}">View CV</button>`
    : `<span class="muted">No CV</span>`;

  return `
    <tr data-job-id="${cleanText(job.id)}" data-application-id="${cleanText(applicationId)}">
        <td>
            <strong>${cleanText(applicantName)}</strong>
            <p class="muted" style="margin: 4px 0 0;">${cleanText(applicantProfession)}</p>
            <p class="muted" style="margin: 4px 0 0;">${cleanText(applicantLocation)}</p>
        </td>
        <td>
            ${cleanText(applicantEmail)}
            <p class="muted" style="margin: 4px 0 0;">${cleanText(applicantPhone)}</p>
            <p class="muted" style="margin: 4px 0 0;">${cleanText(applicantExperience)}</p>
        </td>
        <td>
            <strong>${cleanText(job.myjobtitle)}</strong>
            <p class="muted" style="margin: 4px 0 0;">${cleanText(job.mycompany)}</p>
            <p class="muted" style="margin: 4px 0 0;">Skills: ${cleanText(applicantSkills)}</p>
        </td>
        <td>${cleanText(data.appliedAt || "Today")}</td>
        <td><span class="status review">${cleanText(data.applicationStatus || "In Review")}</span></td>
        <td>${cvButton}</td>
        <td>
            <div class="item-actions">
                <button class="btn btn-outline" type="button" data-open-job="${cleanText(job.id)}">View</button>
            </div>
        </td>
    </tr>
  `;
}

function getOpenTime(data) {
  return "Open for 21 days";
}

function isNewJob(createdAt) {
  const created = new Date(createdAt || "");
  if (Number.isNaN(created.getTime())) return false;

  return Date.now() - created.getTime() <= 24 * 60 * 60 * 1000;
}

function saveDraft() {
  const data = getdata();
  if (!data) return;

  localStorage.setItem(POST_DRAFT_KEY, JSON.stringify(data));
  showMessage("Draft saved. You can come back later and continue editing.");
}

function loadDraft() {
  const savedData = localStorage.getItem(POST_DRAFT_KEY);
  if (!savedData) return;

  try {
    fillForm(JSON.parse(savedData));
    showMessage("Saved draft loaded.");
  } catch (error) {
    localStorage.removeItem(POST_DRAFT_KEY);
  }
}

function setuser(event) {
  if (event) event.preventDefault();

  if (!isLoggedIn()) {
    goToLogin();
    return false;
  }

  const data = getdata();
  if (!data) return;

  if (!validateRequired(data)) {
    showMessage("Please fill Job Title, Company, Location, and Job Description before publishing.");
    return false;
  }

  savePostedJob(data);
  localStorage.removeItem(POST_DRAFT_KEY);
  showMessage("Job published successfully.");
  return true;
}

function renderPostedJobs() {
  if (!jobgrid) return;

  const jobs = [...getPostedJobs().filter((job) => job.status !== "closed"), ...defaultJobs];
  const uniqueJobs = jobs.filter((job, index, list) =>
    list.findIndex((item) => String(item.id) === String(job.id)) === index
  );

  jobgrid.innerHTML = uniqueJobs.map(jobCardTemplate).join("");
  updateActionButtons();
  filterJobs();
}

function resetJobGridAndReload() {
  if (!jobgrid) return;
  renderPostedJobs();
}

function renderMyJobs() {
  if (!myjobstable) return;

  const ownerEmail = getCurrentUserEmail();
  const jobs = getPostedJobs().filter((job) => job.ownerEmail === ownerEmail);
  if (!jobs.length) {
    myjobstable.innerHTML = `
      <tr>
        <td colspan="5" class="muted">No jobs posted yet.</td>
      </tr>
    `;
    return;
  }

  myjobstable.innerHTML = jobs.map(myJobRowTemplate).join("");
}

function renderSavedJobs() {
  if (!savedjobslist) return;

  const jobs = getSavedJobs();
  if (!jobs.length) {
    savedjobslist.innerHTML = `<p class="muted empty-state">No saved jobs yet.</p>`;
    return;
  }

  savedjobslist.innerHTML = jobs.map(savedJobTemplate).join("");
}

function renderAppliedJobs() {
  if (!appliedjobsbody) return;

  const applicantEmail = getCurrentUserEmail();
  const jobs = getAppliedJobs().filter((job) =>
    job.applicant &&
    job.applicant.email === applicantEmail
  );
  if (!jobs.length) {
    appliedjobsbody.innerHTML = `
      <tr>
        <td colspan="5" class="muted">No applied jobs yet.</td>
      </tr>
    `;
    return;
  }

  appliedjobsbody.innerHTML = jobs.map(appliedJobRowTemplate).join("");
}

function renderMyJobAppliers() {
  if (!myappliersbody) return;

  const ownerEmail = getCurrentUserEmail();
  const applications = getAppliedJobs().filter((job) =>
    job.ownerEmail === ownerEmail &&
    job.applicant &&
    job.applicant.email !== ownerEmail
  );
  if (!applications.length) {
    myappliersbody.innerHTML = `
      <tr>
        <td colspan="7" class="muted">No one has applied to your jobs yet.</td>
      </tr>
    `;
    return;
  }

  myappliersbody.innerHTML = applications.map(myApplierRowTemplate).join("");
}

function getJobFromCard(card) {
  const id = card.dataset.jobId;
  const storedJob = [...getPostedJobs(), ...defaultJobs].find((job) => String(job.id) === String(id));

  if (storedJob) return storedJob;

  return {
    id: id || Date.now(),
    myjobtitle: card.querySelector("h4") ? card.querySelector("h4").textContent.trim() : "",
    mycompany: card.querySelector(".company-name") ? card.querySelector(".company-name").textContent.trim() : "",
    myjobtype: card.querySelector(".job-meta span:nth-child(1)") ? card.querySelector(".job-meta span:nth-child(1)").textContent.trim() : "",
    mylocation: card.querySelector(".job-meta span:nth-child(2)") ? card.querySelector(".job-meta span:nth-child(2)").textContent.trim() : "",
    mysalaryrange: card.querySelector(".job-meta span:nth-child(3)") ? card.querySelector(".job-meta span:nth-child(3)").textContent.trim() : "",
    myjobdescription: card.querySelector(".job-desc") ? card.querySelector(".job-desc").textContent.trim() : "",
    myrequirements: "",
    externalUrl: card.querySelector(".card-footer a[target='_blank']") ? card.querySelector(".card-footer a[target='_blank']").href : "",
    isExternal: Boolean(card.querySelector(".card-footer a[target='_blank']")),
    status: "open"
  };
}

function findJobById(id) {
  return [...getPostedJobs(), ...defaultJobs, ...getSavedJobs(), ...getAppliedJobs()]
    .find((job) => String(job.id) === String(id));
}

function getLoggedInUser() {
  const email = sessionStorage.getItem(POST_AUTH_KEY);
  if (!email) return null;

  try {
    const users = JSON.parse(localStorage.getItem("userall")) || [];
    return users.find((user) => user.useremailvalue === email) || null;
  } catch (error) {
    return null;
  }
}

function getStoredApplicantProfile(email) {
  if (!email) return {};

  try {
    return JSON.parse(localStorage.getItem(`profile:${email}`)) || {};
  } catch (error) {
    localStorage.removeItem(`profile:${email}`);
    return {};
  }
}

function getApplicantDetails() {
  const user = getLoggedInUser();
  const email = user ? user.useremailvalue : sessionStorage.getItem(POST_AUTH_KEY);
  const profile = getStoredApplicantProfile(email);
  const name = profile.name || sessionStorage.getItem("profileName") || (user ? user.usernamevalue : "");

  return {
    name: name || "Applicant",
    email: email || "No email",
    profession: profile.profession || sessionStorage.getItem("profileProfession") || "Professional",
    phone: profile.phone || sessionStorage.getItem("profilePhone") || "No phone added",
    location: profile.location || sessionStorage.getItem("profileLocation") || "",
    experience: profile.experience || sessionStorage.getItem("profileExperience") || "",
    skills: profile.skills || sessionStorage.getItem("profileSkills") || "",
    cvName: profile.cvName || sessionStorage.getItem("profileCvName") || "",
    cvData: profile.cvData || sessionStorage.getItem("profileCvData") || "",
    cvType: profile.cvType || sessionStorage.getItem("profileCvType") || ""
  };
}

function saveJob(card) {
  const job = getJobFromCard(card);
  const savedjobs = getSavedJobs();
  card.dataset.jobId = job.id;

  const alreadySaved = savedjobs.some((savedjob) =>
    String(savedjob.id) === String(job.id) ||
    (
      savedjob.myjobtitle === job.myjobtitle &&
      savedjob.mycompany === job.mycompany
    )
  );

  if (!alreadySaved) {
    savedjobs.unshift(job);
    setSavedJobs(savedjobs);
  }
}

function applyJob(job) {
  if (job.ownerEmail && job.ownerEmail === getCurrentUserEmail()) {
    return false;
  }

  const appliedjobs = getAppliedJobs();
  const applicant = getApplicantDetails();
  const alreadyApplied = appliedjobs.some((appliedjob) =>
    (
      String(appliedjob.id) === String(job.id) &&
      appliedjob.applicant &&
      appliedjob.applicant.email === applicant.email
    ) ||
    (
      appliedjob.myjobtitle === job.myjobtitle &&
      appliedjob.mycompany === job.mycompany &&
      appliedjob.applicant &&
      appliedjob.applicant.email === applicant.email
    )
  );

  if (!alreadyApplied) {
    appliedjobs.unshift({
      ...job,
      applicationId: `${job.id}-${Date.now()}`,
      applicant,
      appliedAt: new Date().toLocaleDateString("en", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }),
      applicationStatus: "In Review"
    });
    setAppliedJobs(appliedjobs);
  }

  return true;
}

function updateActionButtons() {
  if (!jobgrid) return;

  const savedjobs = getSavedJobs();
  const appliedjobs = getAppliedJobs();
  const applicant = getApplicantDetails();

  jobgrid.querySelectorAll(".job-card").forEach((card) => {
    const id = card.dataset.jobId;
    const savebtn = card.querySelector(".save-job-btn");
    const applybtn = card.querySelector(".apply-job-btn");

    if (savebtn && savedjobs.some((job) => String(job.id) === String(id))) {
      savebtn.textContent = "Saved";
    }

    if (applybtn && appliedjobs.some((job) =>
      String(job.id) === String(id) &&
      job.applicant &&
      job.applicant.email === applicant.email
    )) {
      applybtn.textContent = "Applied";
    }
  });
}

function getSelectedJobTypes() {
  return Array.from(document.querySelectorAll("[data-job-type-filter]:checked"))
    .map((input) => input.value.toLowerCase());
}

function passesDateFilter(card, value) {
  if (!value || value === "all") return true;

  const created = new Date(card.dataset.createdAt || "");
  if (Number.isNaN(created.getTime())) return true;

  const days = Number(value);
  const diff = Date.now() - created.getTime();
  return diff <= days * 24 * 60 * 60 * 1000;
}

function filterJobs() {
  if (!jobgrid) return;

  const searchvalue = searchinput ? searchinput.value.trim().toLowerCase() : "";
  const locationvalue = locationfilter ? locationfilter.value.toLowerCase() : "all";
  const postedvalue = postedfilter ? postedfilter.value : "all";
  const types = getSelectedJobTypes();
  const cards = jobgrid.querySelectorAll(".job-card");

  cards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    const cardlocation = (card.dataset.location || "").toLowerCase();
    const cardtype = (card.dataset.jobType || "").toLowerCase();
    const matchesSearch = !searchvalue || text.includes(searchvalue);
    const matchesLocation = locationvalue === "all" || cardlocation.includes(locationvalue);
    const matchesType = !types.length || types.includes(cardtype);
    const matchesDate = passesDateFilter(card, postedvalue);

    card.hidden = !(matchesSearch && matchesLocation && matchesType && matchesDate);
  });
}

function debounce(callback, delay = 500) {
  let timer;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => callback(...args), delay);
  };
}

if (jobgrid) {
  jobgrid.addEventListener("click", (event) => {
    const savebtn = event.target.closest(".save-job-btn");
    const applybtn = event.target.closest(".apply-job-btn");
    if (!savebtn && !applybtn) return;

    const card = event.target.closest(".job-card");
    if (!card) return;

    if (!isDashboardPage() || !isLoggedIn()) {
      goToLogin();
      return;
    }

    const job = getJobFromCard(card);

    if (savebtn) {
      saveJob(card);
      savebtn.textContent = "Saved";
      showMessage("Job saved.");
    }

    if (applybtn) {
      const applied = applyJob(job);
      if (applied) {
        applybtn.textContent = "Applied";
        showMessage("Application added to Jobs Applied.");
      } else {
        showMessage("You cannot apply to your own posted job.");
      }
    }
  });
}

if (searchform && jobgrid) {
  searchform.addEventListener("submit", (event) => {
    event.preventDefault();
    resetJobGridAndReload();
  });
}

if (searchinput) {
  searchinput.addEventListener("input", filterJobs);
}

if (locationfilter) {
  locationfilter.addEventListener("change", resetJobGridAndReload);
}

if (postedfilter) {
  postedfilter.addEventListener("change", filterJobs);
}

document.querySelectorAll("[data-job-type-filter]").forEach((input) => {
  input.addEventListener("change", filterJobs);
});

if (clearfilters) {
  clearfilters.addEventListener("click", (event) => {
    event.preventDefault();
    if (searchinput) searchinput.value = "";
    if (locationfilter) locationfilter.value = "all";
    if (postedfilter) postedfilter.value = "all";
    document.querySelectorAll("[data-job-type-filter]").forEach((input) => {
      input.checked = false;
    });
    filterJobs();
  });
}

if (savedjobslist) {
  savedjobslist.addEventListener("click", (event) => {
    const removebtn = event.target.closest("[data-remove-saved], [data-remove-item]");
    const applybtn = event.target.closest(".apply-saved-btn");
    const item = event.target.closest(".item-card");
    if (!item) return;

    const id = item.dataset.jobId;

    if (applybtn) {
      const job = findJobById(id);
      if (job) {
        const applied = applyJob(job);
        if (applied) {
          applybtn.textContent = "Applied";
        }
      }
      return;
    }

    if (!removebtn) return;

    if (id) {
      const savedjobs = getSavedJobs().filter((job) => String(job.id) !== String(id));
      setSavedJobs(savedjobs);
    }

    item.remove();
    renderSavedJobs();
  });
}

if (appliedjobsbody) {
  appliedjobsbody.addEventListener("click", (event) => {
    const removebtn = event.target.closest("[data-remove-applied]");
    if (!removebtn) return;

    const row = removebtn.closest("tr");
    if (!row) return;

    const id = row.dataset.jobId;
    const applicationId = row.dataset.applicationId;
    const applicantEmail = getCurrentUserEmail();
    if (id || applicationId) {
      const appliedjobs = getAppliedJobs().filter((job) => {
        if (job.applicant && job.applicant.email !== applicantEmail) {
          return true;
        }

        if (applicationId && job.applicationId) {
          return String(job.applicationId) !== String(applicationId);
        }

        return String(job.id) !== String(id);
      });
      setAppliedJobs(appliedjobs);
    }

    renderAppliedJobs();
  });
}

if (myappliersbody) {
  myappliersbody.addEventListener("click", (event) => {
    const cvbtn = event.target.closest("[data-view-cv]");
    if (!cvbtn) return;

    const application = getAppliedJobs().find((job) =>
      String(job.applicationId || job.id) === String(cvbtn.dataset.viewCv)
    );

    if (!application || !application.applicant || !application.applicant.cvData) {
      alert("No CV found for this applicant.");
      return;
    }

    const cvwindow = window.open("");
    if (!cvwindow) {
      alert("Allow popups to view this CV.");
      return;
    }

    const title = cleanText(application.applicant.cvName || "Applicant CV");
    const cvData = application.applicant.cvData;
    const cvType = application.applicant.cvType || "";
    const preview = cvType.startsWith("image/")
      ? `<img src="${cvData}" alt="${title}" style="max-width:100%;height:auto;">`
      : `<iframe src="${cvData}" title="${title}" style="width:100%;height:95vh;border:0;"></iframe>`;

    cvwindow.document.write(`
      <!doctype html>
      <html>
        <head><title>${title}</title></head>
        <body style="margin:0;padding:16px;font-family:Arial,sans-serif;">
          <h1 style="font-size:18px;margin:0 0 12px;">${title}</h1>
          ${preview}
        </body>
      </html>
    `);
    cvwindow.document.close();
  });
}

if (postform) {
  postform.addEventListener("submit", (event) => {
    const published = setuser(event);

    if (published) {
      postform.reset();
    }
  });
  loadDraft();
}

if (savedraft) {
  savedraft.addEventListener("click", saveDraft);
}

renderPostedJobs();
renderMyJobs();
renderSavedJobs();
renderAppliedJobs();
renderMyJobAppliers();
