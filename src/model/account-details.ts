export interface Favorites {
  id?: number;
  favorite: string;
}

export interface WorkExperience {
  id?: number;
  companyName: string;
  companyLogo: string;
  title: string;
  startDate: string;
  endDate: string;
  present: boolean;
}
export interface Language{
  language: string;
  level: string;
}
export class AccountDetails {
  id?: number;
  personalInfo?: string;
  location?: string;
  workExperiences?: WorkExperience[];
  favorites?:Favorites[];
  languages?:Language[];


}
