otre.math = {
  abs: function(num) {
    if (num >= 0) return num;
    else return num * -1;
  },
  max: function(num1, num2) {
    if (num1 > num2) return num1;
    else return num2;
  },
  min: function(num1, num2) {
    if (num1 > num2) return num2;
    else return num1;
  },
  isEven: function(num1) {
    if ((num1 % 2) == 0) return true;
    else return false;
  }
};
