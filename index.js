const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL
} = require("@solana/web3.js")

const wallet = new Keypair()
const publicKey = new PublicKey(wallet._keypair.publicKey)
const secretKey = wallet._keypair.secretKey
const NUM_SOL_TO_AIRDROP = 2

const getWalletBalance = async() => {
    try {
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
        const walletBalance = await connection.getBalance(publicKey)
        console.log(`Wallet balance is ${walletBalance / LAMPORTS_PER_SOL} sol`)
    } catch(err) {
        console.error(err)
    }
}

const airdropSol = async(num_sol) => {
    try {
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
        const airDropSignature = await connection.requestAirdrop(publicKey, num_sol * LAMPORTS_PER_SOL)
        const latestBlockHash = await connection.getLatestBlockhash()
        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: airDropSignature,
        })
    } catch (err) {
        console.error(err)
    }
}

const main = async(num_sol) => {
    await getWalletBalance()
    console.log(`Airdropping ${num_sol} sol...`)
    await airdropSol(num_sol)
    await getWalletBalance()
}

main(NUM_SOL_TO_AIRDROP)