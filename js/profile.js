const profileimg=document.querySelector(".profile-img");
const profileinitial=document.querySelector(".profile-initial");
const profileupload=document.querySelector(".profile-upload");
const profilebtn=document.querySelector("[data-pick-profile]");
const dashusername=document.querySelector(".dash-username");
const dashprofession=document.querySelector(".badge-blue");
const topusername=document.querySelector(".username");

function getloginuser(){
  const userdetail=JSON.parse(localStorage.getItem("userall")) || [];
  const useremaillogin=sessionStorage.getItem("authUserEmail");
  return userdetail.find((u)=>useremaillogin === u.useremailvalue);
}

function setprofile(name,profession){
  const username=name || "User";
  const userprofession=profession || "Professional";

  sessionStorage.setItem("profileName",username);
  sessionStorage.setItem("profileProfession",userprofession);

  if (dashusername) dashusername.textContent=username;
  if (topusername) topusername.textContent=username;
  if (dashprofession) dashprofession.textContent=userprofession;
  if (profileinitial) profileinitial.textContent=username.charAt(0).toUpperCase() || "?";
}

function setprofileimage(image){
  if (!profileimg || !profileinitial) return;

  if (image) {
    profileimg.src=image;
    profileimg.style.display="block";
    profileinitial.style.display="none";
  } else {
    profileimg.src="";
    profileimg.style.display="none";
    profileinitial.style.display="flex";
  }
}

function loadprofile(){
  const user=getloginuser();
  const name=sessionStorage.getItem("profileName") || (user ? user.usernamevalue : "User");
  const profession=sessionStorage.getItem("profileProfession") || "Professional";
  const image=sessionStorage.getItem("profileImage") || "";

  setprofile(name,profession);
  setprofileimage(image);
}

if (profilebtn && profileupload) {
  profilebtn.addEventListener("click",()=>{
    profileupload.click();
  });

  profileupload.addEventListener("change",()=>{
    const file=profileupload.files[0];
    if (!file) return;

    const reader=new FileReader();
    reader.addEventListener("load",()=>{
      sessionStorage.setItem("profileImage",reader.result);
      setprofileimage(reader.result);
    });
    reader.readAsDataURL(file);
  });
}

window.setprofile=setprofile;
loadprofile();
