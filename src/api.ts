import express from "express";
import { AccountRepositoryDatabase } from './AccountRepository';
import Signup from "./signup";
import GetAccount from "./GetAccount";
import Registry from "./Registry";

const app = express();
app.use(express.json());
const accountRepository = new AccountRepositoryDatabase()
Registry.getInstance().provide("accountRepository", accountRepository)
const signup = new Signup()
const getAccount = new GetAccount()

app.post("/signup", async function (req, res) {
    const input = req.body;
    try {
        const output = await signup.execute(input)
        res.json(output);
    } catch (e: any){
        res.status(422).json({ message: e.message });
    }
});

app.get("/accounts/:accountId", async function (req, res) {
    const accountId = req.params.accountId;
    const output = await getAccount.execute(accountId)
    res.json(output);
});

app.listen(3001);