import AccountDAO from "./data";

export default class GetAccount {
	constructor(readonly accountDAO: AccountDAO) { }

	async execute (accountId: string) {
		return await this.accountDAO.getAccountById(accountId)
	}
}

