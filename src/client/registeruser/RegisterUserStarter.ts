import { ajaxAsync } from '../communication/AjaxHelper';
import { BaseResponse, VidisNewUserRequest } from '../communication/Data';
import '/include/css/registerUser.css';


window.onload = () => {

    document.getElementById('newAccountButton').addEventListener('pointerdown', () => {
        let rufname: string = (<HTMLInputElement>document.getElementById('rufname')).value + "";
        let familienname: string = (<HTMLInputElement>document.getElementById('familienname')).value + "";
        if(rufname.length == 0){
            document.getElementById('message2').textContent = "Bitte geben Sie Ihren Rufnamen ein.";
        } else if(familienname.length == 0){
            document.getElementById('message2').textContent = "Bitte geben Sie Ihren Familiennamen ein.";
        } else {
            document.getElementById('message2').textContent = "";
            document.getElementById('login-spinner').style.visibility = "visible";   
            
            let request: VidisNewUserRequest = {
                rufname: rufname,
                familienname: familienname,
                klasse: (<HTMLInputElement>document.getElementById('klasse')).value + ""
            }

        }
    })



}

function doRequest(request: VidisNewUserRequest){
 
    fetch("/vidisNewUser", {
        method: "POST",
        body: JSON.stringify(request)
    }).then(resp => {
        resp.json().then((newUserResponse: BaseResponse) => {
            if(newUserResponse.success){
                window.location.assign("/index.html");
            } else {
                alert("Fehler beim Anmelden:\n" + newUserResponse.message);
            }
        })
    })




}