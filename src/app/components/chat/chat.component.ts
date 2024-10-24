import { AfterViewChecked, Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterLink],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements AfterViewChecked{
  messages:any[]=[];
  inputMessage = "";
  loggedInUserName= sessionStorage.getItem("user");
  roomName = sessionStorage.getItem("room");
  @ViewChild('scrollMe')private scrollContainer!:ElementRef;
constructor(public chatService:ChatService,public router:Router){
}

ngOnInit():void{
this.chatService.messages$.subscribe(response =>{
  this.messages = response;
  console.log(this.messages);
});
this.chatService.connectedUsers$.subscribe(res=>{
  console.log(res);
});
}
ngAfterViewChecked():void{
  this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
}
sendMessage(){
  this.chatService.sendMessage(this.inputMessage)
  .then(()=>{
    this.inputMessage = '';
  }).catch((e)=>{
    console.log(e);
  })
}

leaveChat(){
  this.chatService.leaveChat()
  .then(()=>{
    this.chatService.users = [];
    this.chatService.messages=[];
    this.router.navigate(['/user']);
// setTimeout(()=>{
//   location.reload();
// },0);
  }).catch((e)=>{
    console.log(e);
  })
}
}
