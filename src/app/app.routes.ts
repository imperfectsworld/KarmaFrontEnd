import { Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { UserComponent } from './components/user/user.component';
import { JoinRoomComponent } from './components/join-room/join-room.component';
import { ItemComponent } from './components/item/item.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    {path:"user",component:UserComponent},
    {path:"chat",component:ChatComponent},
    {path:"join-room",component:JoinRoomComponent},
    {path:"item",component:ItemComponent},
    {path:"home",component:HomeComponent},
    {path:"",redirectTo:"/home",pathMatch:"full"},
    {path: "**", redirectTo: "/home"}
];
