
import { GoogleSigninButtonModule, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, EventEmitter, Output } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { User } from '../../models/user';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JoinRoomComponent } from '../join-room/join-room.component';
import { ItemComponent } from '../item/item.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterOutlet,FormsModule,JoinRoomComponent,GoogleSigninButtonModule,ItemComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  googleUser: SocialUser = {} as SocialUser;
  loggedIn: boolean = false;
  user: User = {} as User;
  
  @Output() userLoggedIn: EventEmitter<User> = new EventEmitter<User>();


  constructor(private activateRoute:ActivatedRoute,private backendService: BackendService, private socialAuthServiceConfig: SocialAuthService, private router: Router){}

  ngOnInit(){
    this.socialAuthServiceConfig.authState.subscribe((userResponse: SocialUser) => {
      this.googleUser = userResponse;
      this.loggedIn = (userResponse != null);
      if(this.loggedIn == true){
        this.user = {
          googleId: this.googleUser.id,
          userName: this.googleUser.name,
          profilePic: this.googleUser.photoUrl
        };
        this.backendService.addUser(this.user).subscribe(response => {console.log(response)});
      }
    })
  }
  signOut(): void{
    this.socialAuthServiceConfig.signOut()
    location.reload();
    this.user = {} as User;
  }
  navigateToJoinRoom() {
    this.router.navigate(['/join-room']);
  }

}