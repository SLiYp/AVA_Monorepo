export const getRandomName = () => {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    const nameLength = Math.floor(Math.random() * 5) + 1;

    let name = "";
    for (let i = 0; i < nameLength; i++) {
        const randomIndex = Math.floor(Math.random() * letters.length);
        name += letters[randomIndex];
    }

    return name.charAt(0).toUpperCase() + name.slice(1);
};

export const getRandomHexColor = () => {
    return `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`;
};

export const getRandomCategory = () => {
    const categories = ["a", "b", "c"];
    return categories[Math.floor(Math.random() * categories.length)];
};
