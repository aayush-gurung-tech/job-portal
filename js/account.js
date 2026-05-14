const accountbtn=document.querySelector("[data-edit-profile]");
const inputs=document.querySelectorAll(".input");
const form=document.querySelector(".profile-form");
const accountusername=document.querySelector("#accountname");
const accountemail=document.querySelector("#accountemail");
const cancel=document.querySelector(".cancel");
const phone=document.querySelector(".phone");
const profession=document.querySelector(".profession");
const locationprofile=document.querySelector(".location-profile");
const experienceprofile=document.querySelector(".experience-profile");
const skillsprofile=document.querySelector(".skills-profile");
const cvinput=document.querySelector(".cv-input");
const cvuploadbtn=document.querySelector(".cv-upload-btn");
const cvresult=document.querySelector(".cv-result");
const cvname=document.querySelector(".cv-name");
const cvmodal=document.querySelector(".cv-modal");
const cvpreview=document.querySelector(".cv-preview");
const cvclose=document.querySelector(".cv-close");
const passwordform=document.querySelector(".password-form");
const currentpassword=document.querySelector(".current-password");
const newpassword=document.querySelector(".new-password");
const confirmpassword=document.querySelector(".confirm-password");
const passwordmessage=document.querySelector("[data-password-message]");

let cvurl="";
let cvtype="";
let savename="";
let saveemail="";
let savephone="";
let saveprofession="";
let savelocation="";
let saveexperience="";
let saveskills="";

function getcurrentemail(){
  return sessionStorage.getItem("authUserEmail") || "";
}

function getusers(){
  try {
    return JSON.parse(localStorage.getItem("userall")) || [];
  } catch (error) {
    localStorage.removeItem("userall");
    return [];
  }
}

function setusers(users){
  localStorage.setItem("userall",JSON.stringify(users));
}

function getloginuser(){
  const email=getcurrentemail();
  return getusers().find((user)=>user.useremailvalue === email);
}

function getprofilekey(){
  return `profile:${getcurrentemail()}`;
}

function getstoredprofile(){
  try {
    return JSON.parse(localStorage.getItem(getprofilekey())) || {};
  } catch (error) {
    localStorage.removeItem(getprofilekey());
    return {};
  }
}

function setstoredprofile(profile){
  localStorage.setItem(getprofilekey(),JSON.stringify(profile));
}

function syncsession(profile){
  sessionStorage.setItem("profileName",profile.name || "User");
  sessionStorage.setItem("profileProfession",profile.profession || "Professional");
  sessionStorage.setItem("profilePhone",profile.phone || "");
  sessionStorage.setItem("profileLocation",profile.location || "");
  sessionStorage.setItem("profileExperience",profile.experience || "");
  sessionStorage.setItem("profileSkills",profile.skills || "");
  sessionStorage.setItem("profileCvName",profile.cvName || "");
  sessionStorage.setItem("profileCvData",profile.cvData || "");
  sessionStorage.setItem("profileCvType",profile.cvType || "");
}

function fillprofile(){
  const user=getloginuser();
  const profile=getstoredprofile();
  const name=profile.name || (user ? user.usernamevalue : "User");
  const email=user ? user.useremailvalue : getcurrentemail();

  if (accountusername) accountusername.value=name;
  if (accountemail) accountemail.value=email;
  if (profession) profession.value=profile.profession || "Professional";
  if (phone) phone.value=profile.phone || "";
  if (locationprofile) locationprofile.value=profile.location || "";
  if (experienceprofile) experienceprofile.value=profile.experience || "";
  if (skillsprofile) skillsprofile.value=profile.skills || "";

  if (profile.cvName && cvname && cvresult) {
    cvname.textContent=profile.cvName;
    cvresult.hidden=false;
    cvurl=profile.cvData || "";
    cvtype=profile.cvType || "";
  }

  savename=name;
  saveemail=email;
  savephone=phone ? phone.value : "";
  saveprofession=profession ? profession.value : "";
  savelocation=locationprofile ? locationprofile.value : "";
  saveexperience=experienceprofile ? experienceprofile.value : "";
  saveskills=skillsprofile ? skillsprofile.value : "";

  syncsession({
    name:savename,
    profession:saveprofession,
    phone:savephone,
    location:savelocation,
    experience:saveexperience,
    skills:saveskills,
    cvName:profile.cvName || "",
    cvData:profile.cvData || "",
    cvType:profile.cvType || ""
  });
}

function disableform(){
  inputs.forEach((input)=>{
    input.disabled=true;
  });
  if (accountemail) accountemail.disabled=true;
}

function enableform(){
  inputs.forEach((input)=>{
    input.disabled=false;
  });
  if (accountemail) accountemail.disabled=true;
}

function setdash(){
  if (window.setprofile) {
    window.setprofile(savename,saveprofession);
  }
}

function resetform(){
  if (accountusername) accountusername.value=savename;
  if (accountemail) accountemail.value=saveemail;
  if (phone) phone.value=savephone;
  if (profession) profession.value=saveprofession;
  if (locationprofile) locationprofile.value=savelocation;
  if (experienceprofile) experienceprofile.value=saveexperience;
  if (skillsprofile) skillsprofile.value=saveskills;
  setdash();
  disableform();
}

function setform(){
  savename=accountusername ? accountusername.value.trim() : "";
  saveemail=accountemail ? accountemail.value.trim() : "";
  savephone=phone ? phone.value.trim() : "";
  saveprofession=profession ? profession.value.trim() : "";
  savelocation=locationprofile ? locationprofile.value.trim() : "";
  saveexperience=experienceprofile ? experienceprofile.value.trim() : "";
  saveskills=skillsprofile ? skillsprofile.value.trim() : "";

  const oldprofile=getstoredprofile();
  const profile={
    ...oldprofile,
    name:savename,
    profession:saveprofession,
    phone:savephone,
    location:savelocation,
    experience:saveexperience,
    skills:saveskills
  };

  setstoredprofile(profile);
  syncsession(profile);

  const users=getusers();
  const user=users.find((item)=>item.useremailvalue === getcurrentemail());
  if (user) {
    user.usernamevalue=savename;
    setusers(users);
  }

  setdash();
  disableform();
}

function previewcv(){
  const profile=getstoredprofile();
  const source=cvurl || profile.cvData;
  const type=cvtype || profile.cvType || "";
  if (!source || !cvpreview || !cvmodal) return;

  cvpreview.innerHTML="";

  if (type.startsWith("image/")) {
    const img=document.createElement("img");
    img.src=source;
    img.alt="CV";
    cvpreview.appendChild(img);
  } else {
    const frame=document.createElement("iframe");
    frame.src=source;
    frame.title="CV";
    cvpreview.appendChild(frame);
  }

  cvmodal.hidden=false;
}

fillprofile();
setdash();
disableform();

if (cvuploadbtn && cvinput) {
  cvuploadbtn.addEventListener("click",()=>{
    const file=cvinput.files[0];
    if (!file) {
      alert("select cv first");
      return;
    }

    const reader=new FileReader();
    reader.addEventListener("load",()=>{
      cvurl=String(reader.result || "");
      cvtype=file.type || "application/octet-stream";

      const profile={
        ...getstoredprofile(),
        cvName:file.name,
        cvData:cvurl,
        cvType:cvtype
      };
      setstoredprofile(profile);
      syncsession(profile);

      if (cvname) cvname.textContent=file.name;
      if (cvresult) cvresult.hidden=false;
    });
    reader.readAsDataURL(file);
  });
}

if (cvresult) {
  cvresult.addEventListener("click",previewcv);
}

if (cvclose) {
  cvclose.addEventListener("click",()=>{
    if (cvmodal) cvmodal.hidden=true;
    if (cvpreview) cvpreview.innerHTML="";
  });
}

if (cvmodal) {
  cvmodal.addEventListener("click",(e)=>{
    if (e.target === cvmodal) {
      cvmodal.hidden=true;
      if (cvpreview) cvpreview.innerHTML="";
    }
  });
}

if (accountbtn) {
  accountbtn.addEventListener("click",()=>{
    enableform();
  });
}

if (cancel) {
  cancel.addEventListener("click",()=>{
    resetform();
  });
}

if (form) {
  form.addEventListener("submit",(e)=>{
    e.preventDefault();
    setform();
  });
}

if (passwordform) {
  passwordform.addEventListener("submit",(e)=>{
    e.preventDefault();

    const users=getusers();
    const user=users.find((item)=>item.useremailvalue === getcurrentemail());

    if (!user) {
      passwordmessage.textContent="Login again before changing password.";
      return;
    }

    if (!currentpassword.value.trim() || !newpassword.value.trim() || !confirmpassword.value.trim()) {
      passwordmessage.textContent="Fill all password fields.";
      return;
    }

    if (user.passwordvalue !== currentpassword.value.trim()) {
      passwordmessage.textContent="Current password is incorrect.";
      return;
    }

    if (newpassword.value.trim().length < 6) {
      passwordmessage.textContent="New password must be at least 6 characters.";
      return;
    }

    if (newpassword.value.trim() !== confirmpassword.value.trim()) {
      passwordmessage.textContent="New password and confirm password do not match.";
      return;
    }

    user.passwordvalue=newpassword.value.trim();
    setusers(users);
    passwordform.reset();
    passwordmessage.textContent="Password changed successfully.";
  });
}
