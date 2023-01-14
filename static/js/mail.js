async function sendemail(address) {
    await fetch(`/mail?mail=${encodeURIComponent(address)}`);
}