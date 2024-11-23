export const generate = () => {
   const str = 'abcdefghijklmnopqrstuvwxyz1234567890';
   let len=5;
   let finalString = '';

   for (let i =0; i < len; i++) {
       finalString += str[Math.floor(Math.random() * str.length)];
   }
   return finalString;
}