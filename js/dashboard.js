const AUTH_KEY = "authUserEmail";
const username = document.querySelector(".username");
const modal = document.querySelector("[data-job-modal]");
const closemodal = document.querySelector("[data-close-modal]");
const modaltitle = document.querySelector("[data-modal-title]");
const modalcompany = document.querySelector("[data-modal-company]");
const modallocation = document.querySelector("[data-modal-location]");
const modaltype = document.querySelector("[data-modal-type]");
const modalsalary = document.querySelectorAll("[data-modal-salary]");
const modaldesc = document.querySelector("[data-modal-desc]");
const modalpublished = document.querySelector("[data-modal-published]");
const modalvacancy = document.querySelector("[data-modal-vacancy]");
const modalexperience = document.querySelector("[data-modal-experience]");
const modalcompanyinfo = document.querySelector("[data-modal-company-info]");
const modalresponsibilities = document.querySelector("[data-modal-responsibilities]");
const modalrequirements = document.querySelector("[data-modal-requirements]");
const JOBS_KEY = "postedJobs";
const SAVED_KEY = "savedJobs";
const APPLIED_KEY = "appliedJobs";

const jobs = {
  frontend: {
    title: "Frontend Developer",
    company: "Arbeitnow Analytics",
    location: "Remote - Nepal",
    type: "Remote",
    salary: "$90k - $120k",
    desc: "Build clean interfaces for hiring dashboards and candidate workflows.",
    published: "May 6, 2026",
    vacancy: "2 Positions",
    experience: "Mid",
    companyinfo: "Hiring team for web and dashboard products.",
    responsibilities: ["Build responsive screens.", "Improve user flows.", "Work with designers."],
    requirements: ["HTML, CSS and JavaScript.", "Frontend project experience.", "Good communication."]
  },
  designer: {
    title: "UI/UX Designer",
    company: "Nimbus Studio",
    location: "Kathmandu",
    type: "Full-Time",
    salary: "Negotiable",
    desc: "Design product screens, improve flows, and work closely with developers.",
    published: "Apr 28, 2026",
    vacancy: "1 Position",
    experience: "Junior",
    companyinfo: "Creative studio building product experiences.",
    responsibilities: ["Create wireframes.", "Design polished UI.", "Test user flows."],
    requirements: ["Figma skill.", "Portfolio required.", "Basic UX knowledge."]
  },
  backend: {
    title: "Backend Developer",
    company: "CloudRiver",
    location: "Lalitpur",
    type: "Full-Time",
    salary: "$70k - $100k",
    desc: "Build APIs and reliable backend services for web products.",
    published: "Apr 30, 2026",
    vacancy: "1 Position",
    experience: "Mid",
    companyinfo: "CloudRiver builds backend systems for growing teams.",
    responsibilities: ["Build APIs.", "Manage databases.", "Fix production issues."],
    requirements: ["Node.js or PHP.", "Database knowledge.", "API experience."]
  }
};

function readstoredjobs(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (error) {
    localStorage.removeItem(key);
    return [];
  }
}

function normalizestoredjob(job) {
  return {
    title: job.myjobtitle || "Job Title",
    company: job.mycompany || "Company",
    location: job.mylocation || "Location",
    type: job.myjobtype || "Full-Time",
    salary: job.mysalaryrange || "Negotiable",
    desc: job.myjobdescription || "Review the job details from the listing.",
    published: job.postedAt || "Today",
    vacancy: job.vacancy || "1 Position",
    experience: job.myexperiencelevel || "Junior",
    companyinfo: `${job.mycompany || "This company"} is hiring through JobPortal.`,
    responsibilities: (job.responsibilities || ["Review role details.", "Apply with your latest profile."]),
    requirements: String(job.myrequirements || "")
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean)
  };
}

function findstoredjob(key) {
  return [...readstoredjobs(JOBS_KEY), ...readstoredjobs(SAVED_KEY), ...readstoredjobs(APPLIED_KEY)]
    .find((job) => String(job.id) === String(key));
}

function setusername() {
  const userdetail = JSON.parse(localStorage.getItem("userall")) || [];
  const useremaillogin = sessionStorage.getItem(AUTH_KEY);
  const user = userdetail.find((u) => useremaillogin === u.useremailvalue);

  if (!user || !username) return;

  username.textContent = user.usernamevalue;
  
}
setusername();

function showtoast(message) {
  let toast = document.querySelector(".toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

function setlist(list, items) {
  if (!list) return;

  list.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}

function openjob(key) {
  if (!modal) return;

  const storedjob = findstoredjob(key);
  const job = storedjob ? normalizestoredjob(storedjob) : (jobs[key] || jobs.frontend);

  if (modaltitle) modaltitle.textContent = job.title;
  if (modalcompany) modalcompany.textContent = job.company;
  if (modallocation) modallocation.textContent = job.location;
  if (modaltype) modaltype.textContent = job.type;
  modalsalary.forEach((item) => item.textContent = job.salary);
  if (modaldesc) modaldesc.textContent = job.desc;
  if (modalpublished) modalpublished.textContent = job.published;
  if (modalvacancy) modalvacancy.textContent = job.vacancy;
  if (modalexperience) modalexperience.textContent = job.experience;
  if (modalcompanyinfo) modalcompanyinfo.textContent = job.companyinfo;
  setlist(modalresponsibilities, job.responsibilities);
  setlist(modalrequirements, job.requirements.length ? job.requirements : ["Profile and relevant experience."]);

  modal.hidden = false;
}

function closejobmodal() {
  if (modal) {
    modal.hidden = true;
  }
}

document.addEventListener("click", (event) => {
  const actionbtn = event.target.closest("[data-action-message]");
  const removebtn = event.target.closest("[data-remove-item]");
  const openbtn = event.target.closest("[data-open-job]");

  if (actionbtn) {
    showtoast(actionbtn.dataset.actionMessage);
  }

  if (removebtn) {
    const item = removebtn.closest("tr") || removebtn.closest(".item-card");
    if (item) item.remove();
  }

  if (openbtn) {
    openjob(openbtn.dataset.openJob);
  }
});

if (closemodal) {
  closemodal.addEventListener("click", closejobmodal);
}

if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closejobmodal();
    }
  });
}
