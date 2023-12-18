export interface IRegistration {
	name: string;
	email: string;
	password: string;
	avatar?: string;
}
export interface IActivationToken {
	token: string;
	activationCode: string;
}

export interface IActivationRequest {
	activationToken: string;
	activationCode: string;
}

export interface ILogInRequest {
	email: string;
	password: string;
}
