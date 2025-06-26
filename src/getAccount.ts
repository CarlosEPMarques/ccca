import AccountDAO from "./data";
import { inject } from "./Registry";

export default class GetAccount {
	@inject("accountDAO")
	accountDAO!: AccountDAO

	async execute (accountId: string) {
		return await this.accountDAO.getAccountById(accountId)
	}
}

