import { Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { UserComponent } from './components/user/user.component';
import { JoinRoomComponent } from './components/join-room/join-room.component';
import { ItemComponent } from './components/item/item.component';

export const routes: Routes = [
    {path:"user",component:UserComponent},
    {path:"chat",component:ChatComponent},
    {path:"join-room",component:JoinRoomComponent},
    {path:"item",component:ItemComponent},
    {path:"",redirectTo:"/user",pathMatch:"full"}
];
