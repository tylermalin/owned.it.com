export function formatUSDC(amount: bigint): string {
    // USDC has 6 decimals
    const dollars = Number(amount) / 1_000_000;
    return `$${dollars.toFixed(2)}`;
}

export function parseUSDC(amount: string): bigint {
    // Remove $ and parse to USDC (6 decimals)
    const cleaned = amount.replace('$', '');
    const dollars = parseFloat(cleaned);
    return BigInt(Math.floor(dollars * 1_000_000));
}

export function shortenAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getIPFSUrl(hash: string): string {
    return `https://ipfs.io/ipfs/${hash}`;
}

export function getReadableError(err: any): string {
    if (!err) return 'Unknown Error';
    const msg = typeof err === 'string' ? err : err.message || '';

    const lowerMsg = msg.toLowerCase();

    // Viem/Ethers often throws CALL_EXCEPTION or require(false) if the transaction would revert 
    // during gas estimation, which happens when there are insufficient funds or allowances.
    if (lowerMsg.includes('insufficient funds') ||
        lowerMsg.includes('exceeds max transaction gas limit') ||
        lowerMsg.includes('gas required exceeds allowance') ||
        lowerMsg.includes('insufficient balance') ||
        lowerMsg.includes('require(false)') ||
        lowerMsg.includes('call_exception') ||
        lowerMsg.includes('execution reverted')) {
        return 'Insufficient funds or gas. Please ensure you have enough USDC (for purchases) and ETH (for gas) in your wallet. (Testnet funds required)';
    }

    if (lowerMsg.includes('user rejected') ||
        lowerMsg.includes('user canceled') ||
        lowerMsg.includes('canceled action') ||
        lowerMsg.includes('[-32603] internal error')) {
        return 'Transaction was cancelled by user.';
    }

    return msg || 'Transaction Failed';
}
