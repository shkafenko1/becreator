import { Component } from '@angular/core';
import { ProfileData } from '../../components/ui/profile/profile-data/profile-data';

@Component({
  selector: 'app-profile',
  imports: [ProfileData],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {

}
