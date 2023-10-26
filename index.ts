import axios from "axios";
import * as fs from "fs";
import { writeFileSync } from "fs-extra";
import os from "os";

const aliUrls = [
  "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Alibaba/Alibaba.list",
  "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/AliPay/AliPay.list",
  "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/CaiNiao/CaiNiao.list",
  "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Eleme/Eleme.list",
  "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/FeiZhu/FeiZhu.list",
  "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Himalaya/Himalaya.list",
  "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/XianYu/XianYu.list",
  "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/XiamiMusic/XiamiMusic.list",
  "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Youku/Youku.list",
];

const txUrls = [
  "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Tencent/Tencent.list",
  "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/TencentVideo/TencentVideo.list",
  "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/WeChat/WeChat.list",
];

const _360Urls = [
  "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/360/360.list",
  "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Camera360/Camera360.list",
];

const byteDance = [
  "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/ByteDance/ByteDance.list",
];

const getUrlRaw = async (url: string): Promise<string> => {
  const resp = await axios.get(url);
  return resp.data;
};

const convertRaw = (data: string) => {
  const result: string[] = [];
  const arrStr = data.split(os.EOL);
  arrStr.forEach((element) => {
    if (element.startsWith("DOMAIN-SUFFIX,") && element.includes(".")) {
      result.push(element.replace("DOMAIN-SUFFIX,", "domain:"));
    } else if (element.startsWith("DOMAIN,")) {
      result.push(element.replace("DOMAIN,", "full:"));
    }
  });
  return result;
};

const main = async (
  urls: string[],
  customRules: string[],
  fileName: string
) => {
  const promises = urls.map((url) => getUrlRaw(url));
  const resps = await Promise.all(promises);
  let arrStr: string[] = customRules;
  resps.forEach((resp) => {
    arrStr = arrStr.concat(convertRaw(resp));
  });
  if (!fs.existsSync("dist")) {
    fs.mkdirSync("dist");
  }
  writeFileSync(fileName, [...new Set(arrStr)].sort().join(os.EOL));
};

(async () => {
  await main(aliUrls, ["domain:mybank.cn"], "dist/ali.txt");
  await main(
    txUrls,
    ["domain:sogou.com", "domain:sogoucdn.com"],
    "dist/tx.txt"
  );
  await main(_360Urls, [], "dist/360.txt");
  await main(byteDance, [], "dist/byteDance.txt");
})();
