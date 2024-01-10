export interface UserSignUpBody {
	userName: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}

export interface User {
	userName: string;
	email: string;
	password: string;
	fullName: string;
}
