import { Component, Input, input } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { User } from '../../models/user';
import { Item } from '../../models/item';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from '../chat/chat.component';
import { UserComponent } from '../user/user.component';
import { GetlocationService } from '../../services/getlocation.service';
import { catchError, mergeMap, retryWhen, throwError, timer } from 'rxjs';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [FormsModule, ChatComponent, UserComponent],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent {
  
  lat:number |null =null;
  long:number |null =null;
  
  constructor(private backendService: BackendService, private socialAuthServiceConfig: SocialAuthService, private userComponent: UserComponent,private getlocationservice:GetlocationService){}
  @Input() googleUser: User = {} as User;
  newItem: boolean = false;
  
  allItems: Item[] = [];
  userProfile: User = {} as User;
  
  formItem: Item = {} as Item;
  selectedFile: File | null = null;
  
  selectedCondition: string = "";
  selectedCategory: string = "";

  imageUrl: string | null = null;

  filteredItems: Item[] = []; // Filter variable
  sortBy: string = 'alphabetical';  //This holds which sort we will use
 
  
  category = [
    {value: "option1", label: "Food"},
    {value: "option2", label: "Services"},
    {value: "option3", label: "Furniture"},
    {value: "option4", label: "Car Seats"},
    {value: "option5", label: "Electronics"},
    {value: "option6", label: "Clothing"},
    {value: "option7", label: "Stroller"},
    {value: "option8", label: "Nursing & Feeding"},
    {value: "option9", label: "Playards"},
    {value: "option10", label: "Bassinets"},
    {value: "option11", label: "Infant Activity"},
    {value: "option8", label: "Infant Toys"}
    
  ];

  condition = [
    {value: "option1", label: "Mint"},
    {value: "option2", label: "Like New"},
    {value: "option3", label: "Used"},
    {value: "option4", label: "Worn"},
    {value: "option5", label: "Broken"}
  ];

  foodCondition = [
    {value: "option1", label: "Perishable"},
    {value: "option2", label: "Non-Perishable"}
  ];

  ngOnInit(){
    this.getAll();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
  }

  signOut(): void{
    this.socialAuthServiceConfig.signOut()
  }

  getAll(){
    this.backendService.getAllItems().subscribe(response=> {
      console.log(response);
      this.allItems = response;
      this.filterItems(); //after all the items are returned call this function to filter and sort them
    });
  }

  addItem(){
    if (!this.formItem.geoCode) {
      alert('Please enter an address.');
      return;
    }
    this.getlocationservice.getLocation(this.formItem.geoCode).subscribe(response =>{
      console.log(response);
      this.lat = response.latitude;
      this.long = response.longitude;
      this.formItem.geoCode = `${this.lat},${this.long}`;
    
    this.formItem.googleId = this.googleUser.googleId;
    this.formItem.categories = this.selectedCategory; 
    this.formItem.condition = this.selectedCondition;
    this.formItem.pic = this.imageUrl || '';
    this.backendService.addItem(this.formItem).subscribe(response=>{
      console.log(response);
      this.getAll();
      this.formItem = {} as Item;
    });
  });
}

uploadImageAndAddItem() {
  if (this.selectedFile) {
    console.log('File selected for upload:', this.selectedFile);

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    const observer = {
      next: (response: any) => {
        console.log('Image upload response:', response);
        if (response && response.data && response.data.link) {
          this.imageUrl = response.data.link;
          this.formItem.pic = this.imageUrl!;
          console.log('Image URL set:', this.imageUrl);
          this.addItem();
        } else {
          console.error('Error: Image URL not found in the response');
          alert('Failed to upload image. Please try again.');
        }
      },
      error: (err: any) => {
        console.error('Image upload failed:', err);
        alert('Image upload failed. Please check your file and try again.');
      },
      complete: () => console.log('Image upload complete')
    };

    this.backendService.uploadImage(formData).subscribe(observer);
  } 
  else {
    console.warn('No file selected for upload.');
    this.addItem();
  }
}

uploadImage(imageFile: File) {
  //this.selectedFile = imageFile;
  //console.log(imageFile);
  const formData = new FormData();
  formData.append('file', imageFile);

  this.backendService.uploadImage(formData).pipe(
    retryWhen(errors =>
      errors.pipe(
        mergeMap(error => {
          if (error.status === 429) {
            const retryAfter = parseInt(error.headers.get('Retry-After'), 10) || 60;
            console.log(`Too many requests. Retrying after ${retryAfter} seconds.`);
            return timer(retryAfter * 1000);
          }
          return throwError(() => new Error(error));
        })
      )
    ),
    catchError(error => {
      console.error('Image upload failed:', error);
      return throwError(() => new Error(error));
    })
  ).subscribe(response => {
    console.log('Image uploaded successfully:', response);
  });
}

 // Sort Method
 sortItems() {
  if (this.sortBy === 'alphabetical') {
    this.filteredItems.sort((a, b) => a.name.localeCompare(b.name));
  } else if (this.sortBy === 'time') {
    // Since we dont have access to date when an item is posted im basing most recent sort by the items ID, the 
    //higher the ID the most recent the item was posted
    this.filteredItems.sort((a, b) => b.id - a.id);
  }
}



  //Filters items based on category and condition
 filterItems() {
   this.filteredItems = this.allItems.filter(item => {
     const categoryMatches = this.selectedCategory ? item.categories === this.selectedCategory : true;
     const conditionMatches = this.selectedCondition ? item.condition === this.selectedCondition : true;
     return categoryMatches && conditionMatches;
  });
   this.sortItems(); // Sort after filtering
 }


  // Option to handle changes in sort or filter
 onSortChange(event: Event): void {
  const selectElement = event.target as HTMLSelectElement; // Safely cast event.target to HTMLSelectElement
  const selectedValue = selectElement.value;

  if (!selectedValue) {
    // If no valid option is selected, do nothing or reset the sorting
    return;
  }

  if (selectedValue === 'alphabetical') {
    this.filteredItems.sort((a, b) => {
      const nameA = a.name || ''; // Fallback to empty string if null
      const nameB = b.name || ''; // Fallback to empty string if null
      return nameA.localeCompare(nameB);
    });
  } 
  else if (selectedValue === 'reverseAlphabetical'){
    this.filteredItems.sort((a, b) => {
      const nameA = a.name || ''; // Fallback to empty string if null
      const nameB = b.name || ''; // Fallback to empty string if null
      return nameB.localeCompare(nameA);
    });
  }
  else if (selectedValue === 'oldest') {
    // Sort by id as a proxy for time posted
    this.filteredItems.sort((a, b) => {
      return a.id - b.id; // Ensure 'id' is a number
    });
  }
  else if (selectedValue === 'newest') {
    // Sort by id as a proxy for time posted
    this.filteredItems.sort((a, b) => {
      return b.id - a.id; // Ensure 'id' is a number
    });
  }
}

  onCategoryChange(category: string) {
    this.selectedCategory = category;
    this.filterItems(); // Refetchs the items based on the new category
  }

  onConditionChange(condition: string) {
    this.selectedCondition = condition;
    this.filterItems(); // Refetchs the items based on the new condition
  }



 openLocation(geoCode: string): void {
 const googleMapsUrl = `https://www.google.com/maps/place/${geoCode}`;
   window.open(googleMapsUrl, '_blank');
}
deleteItem(itemId: number): void {
  this.backendService.deleteItem(itemId).subscribe(response => {
    console.log('Item deleted successfully', response);
    this.getAll();  
  });
}

toggleFormDisplay(){
  this.newItem = !this.newItem;
}


}