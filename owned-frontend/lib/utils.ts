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
