export function mcChatToString(msg) {
  return buildText(msg, '');
}

const colorMap = {
  black: '§0',
  dark_blue: '§1',
  dark_green: '§2',
  dark_aqua: '§3',
  dark_red: '§4',
  dark_purple: '§5',
  gold: '§6',
  gray: '§7',
  dark_gray: '§8',
  blue: '§9',
  green: '§a',
  aqua: '§b',
  red: '§c',
  light_purple: '§d',
  yellow: '§e',
  white: '§f',
  reset: '§r',
};

function buildText(msg, text) {
  let text2 = text;
  if (msg.color) {
    text2 += colorMap[msg.color];
  }
  if (msg.bold) {
    text2 += '§l';
  }
  if (msg.italic) {
    text2 += '§o';
  }
  if (msg.underlined) {
    text2 += '§n';
  }
  if (msg.strikethrough) {
    text2 += '§m';
  }
  if (msg.obfuscated) {
    text2 += '§k';
  }

  text2 += msg.text;

  if (msg.extra) {
    for (const extra of msg.extra) {
      text2 = buildText(extra, text2);
    }
  }
  return text2;
}

const styleMap = {
  0: '#000000',
  1: '#0000AA',
  2: '#00AA00',
  3: '#00AAAA',
  4: '#AA0000',
  5: '#AA00AA',
  6: '#FFAA00',
  7: '#AAAAAA',
  8: '#555555',
  9: '#5555FF',
  a: '#55FF55',
  b: '#55FFFF',
  c: '#FF5555',
  d: '#FF55FF',
  e: '#FFFF55',
  f: '#FFFFFF',
};

export function splitText(msg) {
  const components = msg.split('§');
  let displayComponents = [{text: components[0], style: {color: 'black'}}];

  let style = {color: 'white'};
  let obfuscated = false;

  for (let i = 1; i < components.length; i++) {
    let component = components[i];

    if (obfuscated) {
      component = '?'.repeat(component.length);
    }

    if (component.length > 0) {
      const code = component.charAt(0);

      switch (code) {
        case 'l':
          style.fontWeight = 'bold';
          break;
        case 'o':
          style.fontStyle = 'italic';
          break;
        case 'n':
          style.textDecorationLine =
            style.textDecorationLine === 'line-through' ||
            style.textDecorationLine === 'underline line-through'
              ? 'underline line-through'
              : 'underline';
          break;
        case 'm':
          style.textDecorationLine =
            style.textDecorationLine === 'underline' ||
            style.textDecorationLine === 'underline line-through'
              ? 'underline line-through'
              : 'line-through';
          break;
        case 'k':
          obfuscated = true;
          break;
        case 'r':
          style = {color: 'white'};
          obfuscated = false;
          break;
        default:
          if (styleMap[code]) {
            style.color = styleMap[code];
          }
          break;
      }

      displayComponents.push({text: component.substring(1), style: {...style}});
    }
  }

  return displayComponents;
}
