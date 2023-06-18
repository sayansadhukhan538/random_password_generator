const inputSlider= document.querySelector("[data-Slider]");
const dataLengthDisplay= document.querySelector("[data-passwordLength]");
const passwordCopyMsg= document.querySelector("[data-copyMsg]");
const passwordCopyButton= document.querySelector("[data-copyButton]");
const password=document.querySelector("[data-passwordDisplay]");
const checkboxes=document.querySelectorAll("input[type=checkbox]");
const upperCaseChck=document.querySelector("#uppercase");
const lowerCaseChck=document.querySelector("#lowercase");
const numbersChck=document.querySelector("#numbers");
const symbolsChck=document.querySelector("#symbols");
const strengthIndicator=document.querySelector(".strength-indicator");
const generatePasswordButton=document.querySelector("[data-generatePassword]");


// We put default values for now.
let pass="";
let passwordLength=10;
let checkboxStatus=1;
let strengthOfPassword;
const symbols="+-*/(){}[]`<>:;'!@#$"
upperCaseChck.checked=true;
setStrengthIndicator("initial");

handleSlider();

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider()
})


passwordCopyButton.addEventListener('click',()=>{
   if(password.lenght>0)
   {
    copyContent();
   }
})

async function copyContent(){
    if(password.value=="")
    {
        passwordCopyMsg.textContent="Nothing To Copy";

        passwordCopyMsg.classList.add("active");

        setTimeout(() => {
            passwordCopyMsg.classList.remove("active");
        }, 2000);

        return;
    }
    try{
    await navigator.clipboard.writeText(password.value);
    passwordCopyMsg.textContent="Copied";
    }
    catch(e)
    {
        passwordCopyMsg.textContent="Error. Please Refresh Your Browser.";
    }

    passwordCopyMsg.classList.add("active");

    setTimeout(() => {
        passwordCopyMsg.classList.remove("active");
    }, 2000);

}

checkboxes.forEach((checkbox)=>{
    checkbox.addEventListener('change',()=>{handleCheckboxChange()});
})

function handleCheckboxChange(){

    checkboxStatus=0;

    checkboxes.forEach((checkbox)=> {
        if(checkbox.checked)
        {
            checkboxStatus++;
        }
    });

    if(passwordLength<checkboxStatus)
    {
        passwordLength=checkboxStatus;
        handleSlider();
    }
}

generatePasswordButton.addEventListener('click',()=>{
    if(checkboxStatus<=0) {
        alert("Please Check Atleast One CheckBox Options");
        return;
    }

    handleCheckboxChange();

    pass="";

    const funcArray=[];

    if(upperCaseChck.checked)
    {
        funcArray.push(getUpperCase);
    }

    if(lowerCaseChck.checked)
    {
        funcArray.push(getLowerCase);
    }

    if(numbersChck.checked)
    {
        funcArray.push(generateRandomNo);
    }

    if(symbolsChck.checked)
    {
        funcArray.unshift(generateSymbol);
    }

    for(let i=0;i<funcArray.length; i++){
        pass+=funcArray[i]();
    }

    for(let i=0;i<passwordLength-funcArray.length; i++){
        pass+=funcArray[getRandomInt(0,funcArray.length-1)]();
    }

    pass=shufflePassword(Array.from(pass));

    password.value=pass;

    calcPasswordStrength();
})

function shufflePassword(pass){
    // Fisher Yates Method (Used To Shuufle Values In A Array)
    for (let i=pass.length-1;i>00;i--)
    {
        const j=Math.floor(Math.random()*(i+1));
        const temp=pass[i];
        pass[i]=pass[j]
        pass[j]=temp;
    }

    let str="";
    pass.forEach((el)=>(str+=el));
    return str;

}

// This function sets the password length accordin to slider input
function handleSlider(){
    inputSlider.value= passwordLength;
    dataLengthDisplay.textContent= passwordLength;

    // The below codde controls the slider color which changes accordingly to the slider position, whihc means the color cyan is only upto the thumb
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
    
}

function getRandomInt(min,max){
    return Math.floor((Math.random() * (max-min+1))+min); 
}

function generateRandomNo(){
    return getRandomInt(0,9);
}

function getLowerCase(){
    return String.fromCharCode(getRandomInt(97,122));
}

function getUpperCase(){
    return String.fromCharCode(getRandomInt(65,90));
}

function generateSymbol(){
    return symbols.charAt(getRandomInt(0,symbols.length-1));
}

function calcPasswordStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    if(upperCaseChck.checked) hasUpper=true;
    if(lowerCaseChck.checked) hasLower=true;
    if(numbersChck.checked) hasNum=true;
    if(symbolsChck.checked) hasSym=true;
    

    if(hasUpper && hasLower && hasNum && hasSym && passwordLength>=8)
    {
        setStrengthIndicator("strong");
    }

    else if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=6)
    {
        setStrengthIndicator("medium");
    }

    else
    {
        setStrengthIndicator("weak");
    }
}

function setStrengthIndicator(strength){
    strengthIndicator.classList.remove(strengthOfPassword);
    strengthIndicator.classList.add(strength);
    strengthOfPassword=strength;
}

