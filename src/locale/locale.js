import en from './en';
import zh from './zh';
import es from './es';
import zh_tw from './zh_tw';
import Store from '../store';

const localeObj = {
  en, zh, es, zh_tw,
};

/**
 * @returns {typeof zh}
 */
function locale() {
  return localeObj[Store.lang] || zh;
}

export default locale;
