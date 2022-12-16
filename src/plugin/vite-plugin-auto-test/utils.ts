export const sleep = (wait: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('');
    }, wait);
  });
};

export const getRandomNum = (nums: number) => {
  return Math.floor(Math.random() * nums + 1);
};
