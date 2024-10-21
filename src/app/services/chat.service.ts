import { Injectable } from '@angular/core';
import * as signalR from'@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public connection:signalR.HubConnection = new signalR.HubConnectionBuilder()
  .withUrl("https://karmabackend.azurewebsites.net/chat")
  .configureLogging(signalR.LogLevel.Information)
  .build();

public messages$ = new BehaviorSubject<any>([]);
public connectedUsers$ = new BehaviorSubject<string[]>([]);
public messages:any[] = [];
public users:string[] =[];

  constructor() {
    this.start();
    this.connection.on("ReceiveMessage",(user:string,message:string,messageTime:string) =>{
      console.log("User :" ,user);
      console.log("Message :" ,message);
      console.log("MessageTime :" ,messageTime);
      this.messages =[...this.messages,{user,message,messageTime}];
      this.messages$.next(this.messages);
    });

    this.connection.on("ConnectedUser",(users:any)=>{
      console.log("users :", users);
      this.connectedUsers$.next(users);
    });
   }

  //start connection
  public async start(){
    try{
      await this.connection.start();
      console.log("Connection is established");
    } catch(error){
      console.error("Error while starting connection: ", error);
    }
  }
  public async joinRoom(user: string, room:string){
    return await this.connection.invoke("JoinRoom",{user,room});
  }

  public async sendMessage(message:string){
    return await this.connection.invoke("SendMessage",message);
  }
  public async leaveChat(){
    return await this.connection.stop();
  }

}
