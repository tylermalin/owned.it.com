import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { magic } from './magic';

const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const connection = new Connection(rpcUrl);

export const getSolanaConnection = () => connection;

export const getBalance = async (publicKeyString: string) => {
    try {
        const publicKey = new PublicKey(publicKeyString);
        const balance = await connection.getBalance(publicKey);
        return balance / LAMPORTS_PER_SOL;
    } catch (error) {
        console.error('Error fetching balance:', error);
        return 0;
    }
};

export const requestAirdrop = async (publicKeyString: string) => {
    try {
        const publicKey = new PublicKey(publicKeyString);
        const signature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
        await connection.confirmTransaction(signature);
        return signature;
    } catch (error) {
        console.error('Error requesting airdrop:', error);
        throw error;
    }
};

export const sendSol = async (fromPublicKeyString: string, toPublicKeyString: string, amount: number) => {
    if (!magic) throw new Error('Magic SDK not initialized');

    try {
        const fromPublicKey = new PublicKey(fromPublicKeyString);
        const toPublicKey = new PublicKey(toPublicKeyString);

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: fromPublicKey,
                toPubkey: toPublicKey,
                lamports: amount * LAMPORTS_PER_SOL,
            })
        );

        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = fromPublicKey;

        // Cast magic to any to access solana extension methods not in standard type definition
        const signedTransaction = await (magic as any).solana.signTransaction(transaction, {
            requireAllSignatures: false,
            verifySignatures: true,
        });

        const signature = await connection.sendRawTransaction(signedTransaction.serialize());
        await connection.confirmTransaction(signature);
        return signature;
    } catch (error) {
        console.error('Error sending SOL:', error);
        throw error;
    }
};
