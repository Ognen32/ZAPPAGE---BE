

export const capitalizeTrim  = (name)  => {
    name = name.trim().toLowerCase();
    name = name.charAt(0).toUpperCase() + name.slice(1);
    return name;
};