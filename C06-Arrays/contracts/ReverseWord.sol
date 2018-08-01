pragma solidity ^0.4.23;

contract ReverseWord {
    // 宣告一個動態長度的陣列
    byte[] public stack;

    function reverseWord (
        string word
    )
        public
        // 於函數回傳宣告回傳變數，便不需要於函數內執行return
        returns(string reversed)
    {
        bytes memory wordBytes = bytes(word);
        // 在for迴圈內宣告的uint256 i的可視範圍是整個函數
        for (uint256 i = 0; i < wordBytes.length; i++) {
            // push() 成員只存在於宣告在storag 上的動態陣列
            stack.push(wordBytes[i]);
        }

        // 反轉重組個別byte於bytes
        // 接著利用bytes與string互轉特性，將包含反轉內容的bytes轉為string後回傳
        bytes memory reversedWord = new bytes(wordBytes.length);
        i = 0;
        byte b;
        uint256 length = stack.length;
        while (length > 0) {
            b = stack[length - 1];
            delete stack[length - 1];
            reversedWord[i] = b;
            i++;
            length -= 1;
        }

        delete stack;
        reversed = string(reversedWord);
    }
}