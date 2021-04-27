exports.mcChatToString = (msg) => {
    return buildText(msg, "");
}

const colorMap = {
    black: "§0",
    dark_blue: "§1",
    dark_green: "§2",
    dark_aqua: "§3",
    dark_red: "§4",
    dark_purple: "§5",
    gold: "§6",
    gray: "§7",
    dark_gray: "§8",
    blue: "§9",
    green: "§a",
    aqua: "§b",
    red: "§c",
    light_purple: "§d",
    yellow: "§e",
    white: "§f",
    reset: "§r"
}

function buildText(msg, text) {
    var text2 = text;
    if (msg.color) text2 += colorMap[msg.color];
    if (msg.bold) text2 += "§l";
    if (msg.italic) text2 += "§o";
    if (msg.underlined) text2 += "§n";
    if (msg.strikethrough) text2 += "§m";
    if (msg.obfuscated)  text2 += "§k";

    text2 += msg.text;

    if (msg.extra) {
        for (const extra of msg.extra) {
            text2 = buildText(extra, text2);
        }
    }
    return text2;
}
