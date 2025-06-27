import AccountRepository from "./AccountRepository";
import { inject } from "./Registry";

export default class GetAccount {
	@inject("accountRepository")
	accountRepository!: AccountRepository

	async execute (accountId: string) {
		const account = await this.accountRepository.getAccountById(accountId)
		return account
	}
}

