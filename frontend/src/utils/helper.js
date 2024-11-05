export const getInitials = (name) => {
    const arr = name.split(" ");
    let initials = "";
    arr.forEach(word => {
        initials += word[0];
    });
    return initials.toUpperCase();
}