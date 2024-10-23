
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
      if(this.loggedIn){
        this.user = {
          googleId: this.googleUser.id,
          userName: this.googleUser.name,
          profilePic: this.googleUser.photoUrl
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
    location.reload();
    this.user = {} as User;
  }
  navigateToJoinRoom() {
    this.router.navigate(['/join-room']);
  }
  closeNavbar() {
    const navbar = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.getElementById('navbarNav');
    
    if (navbar && navbarCollapse && navbarCollapse.classList.contains('show')) {
      (navbar as HTMLElement).click();  // Trigger the toggle
    }
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

}