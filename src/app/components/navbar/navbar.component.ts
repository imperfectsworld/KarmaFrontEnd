import { SocialUser, SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { User } from '../../models/user';
import { BackendService } from '../../services/backend.service';
import { FormsModule } from '@angular/forms';
import { JoinRoomComponent } from '../join-room/join-room.component';
import { ItemComponent } from '../item/item.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet,FormsModule,JoinRoomComponent,GoogleSigninButtonModule,ItemComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  googleUser: SocialUser = {} as SocialUser;
  loggedIn: boolean = false;
  user: User = {} as User;
  
  @Output() userLoggedIn: EventEmitter<User> = new EventEmitter<User>();
  constructor(private activateRoute:ActivatedRoute,private backendService: BackendService, private socialAuthServiceConfig: SocialAuthService, private router: Router){}

  ngOnInit(){
    this.socialAuthServiceConfig.authState.subscribe((userResponse: SocialUser) => {
      this.googleUser = userResponse;
      this.loggedIn = (userResponse != null);
      if(this.loggedIn){
        this.user = {
          googleId: this.googleUser.id,
          userName: this.googleUser.name,
          profilePic: this.googleUser.photoUrl,
          email: this.googleUser.email
        };
        this.backendService.addUser(this.user).subscribe(response => {console.log(response)});
      }
    })
  }
  // loginWithGoogle(): void {
  //   this.socialAuthServiceConfig.signIn('google').then(user => {
  //     console.log("User logged in:", user);
  //   }).catch(error => {
  //     console.error("Login failed:", error);
  //   });
  // }
  signOut(): void{
    this.socialAuthServiceConfig.signOut()
   
    this.user = {} as User;
    this.router.navigate(['/home']);
  }
  navigateToJoinRoom() {
    this.router.navigate(['/join-room']);
  }
 
  navigateToHome() {
    this.router.navigate(['/home']);
  }
  navigateToGive() {
    this.router.navigate(['/user']);
  }

}
