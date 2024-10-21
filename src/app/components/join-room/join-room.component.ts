import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-join-room',
  standalone: true,
  imports: [ReactiveFormsModule,ChatComponent],
  templateUrl: './join-room.component.html',
  styleUrl: './join-room.component.css'
})
export class JoinRoomComponent {
  joinRoomForm!: FormGroup; // Reactive form group
isvalid:boolean = false;
  constructor(private fb: FormBuilder,private router:Router,private chatService:ChatService) {}

  ngOnInit(): void {
    // Initialize the form with default values and validation
    this.joinRoomForm = this.fb.group({
      user: ['', Validators.required],
      room: ['', Validators.required]
    });
  }

  // Function to handle form submission
  joinRoom(): void {
   console.log(this.joinRoomForm.value);
   const {user,room} = this.joinRoomForm.value;
   sessionStorage.setItem("user",user);
   sessionStorage.setItem("room",room);
   this.chatService.joinRoom(user,room)
   .then(() =>{
    this.isvalid = true;
    this.router.navigate(['chat']);
   }).catch((e) =>{
    console.log('Error in joining the room',e);
   })
   
  }
}
