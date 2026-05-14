const popedit=document.querySelector(".popedit");
const editform=document.querySelector(".edit-job-form");
const editmessage=document.querySelector("[data-edit-message]");
const closeedit=document.querySelector("[data-close-edit]");

const editjobtitle=popedit ? popedit.querySelector(".job-title") : null;
const editcompany=popedit ? popedit.querySelector(".company") : null;
const editlocation=popedit ? popedit.querySelector(".location") : null;
const editjobtype=popedit ? popedit.querySelector(".job-type") : null;
const editsalaryrange=popedit ? popedit.querySelector(".salary-range") : null;
const editexperiencelevel=popedit ? popedit.querySelector(".experience-level") : null;
const editjobdescription=popedit ? popedit.querySelector(".job-description") : null;
const editrequirements=popedit ? popedit.querySelector(".requirements") : null;

let selectedrow=null;
let selectedjobid=null;

function getcurrentuseremail(){
     return sessionStorage.getItem("authUserEmail") || "";
}

function usercanmanagejob(job){
     return Boolean(job && job.ownerEmail && job.ownerEmail === getcurrentuseremail());
}

function getjobs(){
     try {
          return JSON.parse(localStorage.getItem("postedJobs")) || [];
     } catch (error) {
          localStorage.removeItem("postedJobs");
          return [];
     }
}

function setjobs(jobs){
     localStorage.setItem("postedJobs",JSON.stringify(jobs));
}

function findjob(id){
     const jobs=getjobs();
     const job=jobs.find((item)=>String(item.id) === String(id));
     return usercanmanagejob(job) ? job : null;
}

function showeditform(){
     if (popedit) {
          popedit.hidden=false;
     }
}

function hideeditform(){
     if (popedit) {
          popedit.hidden=true;
     }
     if (editmessage) {
          editmessage.textContent="";
     }
     selectedrow=null;
     selectedjobid=null;
}

function fillform(job){
     if (!job) return;

     editjobtitle.value=job.myjobtitle || "";
     editcompany.value=job.mycompany || "";
     editlocation.value=job.mylocation || "";
     editjobtype.value=job.myjobtype || "Full-Time";
     editsalaryrange.value=job.mysalaryrange || "";
     editexperiencelevel.value=job.myexperiencelevel || "Junior";
     editjobdescription.value=job.myjobdescription || "";
     editrequirements.value=job.myrequirements || "";
}

function getrowjob(row){
     const cells=row.querySelectorAll("td");
     const title=cells[0] ? cells[0].querySelector("strong") || cells[0] : null;
     const company=cells[0] ? cells[0].querySelector(".muted") : null;

     return {
          id: row.dataset.jobId || "",
          myjobtitle: title ? title.textContent.trim() : "",
          mycompany: company ? company.textContent.trim() : "",
          mylocation: cells[1] ? cells[1].textContent.trim() : "",
          myjobtype: "Full-Time",
          mysalaryrange: "",
          myexperiencelevel: "Junior",
          myjobdescription: "",
          myrequirements: ""
     };
}

function getformjob(oldjob){
     return {
          ...oldjob,
          myjobtitle: editjobtitle.value.trim(),
          mycompany: editcompany.value.trim(),
          mylocation: editlocation.value.trim(),
          myjobtype: editjobtype.value.trim(),
          mysalaryrange: editsalaryrange.value.trim(),
          myexperiencelevel: editexperiencelevel.value.trim(),
          myjobdescription: editjobdescription.value.trim(),
          myrequirements: editrequirements.value.trim()
     };
}

function updaterow(row,job){
     const cells=row.querySelectorAll("td");
     if (!cells.length) return;

     cells[0].innerHTML=`
          <strong>${job.myjobtitle}</strong>
          <p class="muted" style="margin: 4px 0 0;">${job.mycompany}</p>
     `;
     cells[1].textContent=job.mylocation;
}

function changestatus(row,status){
     const statusbox=row.querySelector(".status");
     const actionbtn=row.querySelector(".close, .reopen");

     if (statusbox) {
          statusbox.textContent=status === "closed" ? "Closed" : "Open";
          statusbox.classList.remove("open","closed");
          statusbox.classList.add(status);
     }

     if (actionbtn) {
          actionbtn.textContent=status === "closed" ? "Reopen" : "Close";
          actionbtn.classList.remove("close","reopen");
          actionbtn.classList.add(status === "closed" ? "reopen" : "close");
     }
}

function savejobstatus(id,status){
     if (!id) return;

     const jobs=getjobs();
     const job=jobs.find((item)=>String(item.id) === String(id));

     if (usercanmanagejob(job)) {
          job.status=status;
          setjobs(jobs);
     }
}

document.addEventListener("click",(event)=>{
     const editbtn=event.target.closest(".edit");
     const closebtn=event.target.closest(".close");
     const reopenbtn=event.target.closest(".reopen");

     if (editbtn) {
          selectedrow=editbtn.closest("tr");
          selectedjobid=selectedrow ? selectedrow.dataset.jobId : null;

          const job=selectedjobid ? findjob(selectedjobid) : getrowjob(selectedrow);
          if (!job) return;

          fillform(job);
          showeditform();
     }

     if (closebtn) {
          const row=closebtn.closest("tr");
          if (!row) return;
          if (!findjob(row.dataset.jobId)) return;

          changestatus(row,"closed");
          savejobstatus(row.dataset.jobId,"closed");
     }

     if (reopenbtn) {
          const row=reopenbtn.closest("tr");
          if (!row) return;
          if (!findjob(row.dataset.jobId)) return;

          changestatus(row,"open");
          savejobstatus(row.dataset.jobId,"open");
     }
});

if (closeedit) {
     closeedit.addEventListener("click",()=>{
          hideeditform();
     });
}

if (popedit) {
     popedit.addEventListener("click",(event)=>{
          if (event.target === popedit) {
               hideeditform();
          }
     });
}

if (editform) {
     editform.addEventListener("submit",(event)=>{
          event.preventDefault();

          if (!editjobtitle.value.trim() || !editcompany.value.trim() || !editlocation.value.trim()) {
               if (editmessage) {
                    editmessage.textContent="Fill job title, company and location.";
               }
               return;
          }

          const oldjob=selectedjobid ? findjob(selectedjobid) : getrowjob(selectedrow);
          const newjob=getformjob(oldjob);

          if (selectedjobid) {
               const jobs=getjobs();
               const index=jobs.findIndex((job)=>String(job.id) === String(selectedjobid));

               if (index !== -1) {
                    jobs[index]=newjob;
                    setjobs(jobs);
               }
          }

          if (selectedrow) {
               updaterow(selectedrow,newjob);
          }

          hideeditform();
     });
}
