pragma solidity ^0.4.23;

// Contract source from:
// https://ethereum.stackexchange.com/questions/1517/sorting-an-array-of-integer-with-ethereum
contract Sorter {
    uint[] public data;
    // 儘管array被宣告為public，從測試案例讀取array需要建立函數
    function get() public view returns(uint[]) {return data;}
    function set(uint[] _data) public { data = _data; }
    function sort() public {
        if (data.length == 0)
            return;
        quickSort(data, 0, data.length - 1);
    }
    function quickSort(uint[] storage arr, uint left, uint right) internal {
        uint i = left;
        uint j = right;
        uint pivot = arr[left + (right - left) / 2];
        while (i <= j) {
            while (arr[i] < pivot) i++;
            while (pivot < arr[j]) j--;
            if (i <= j) {
                (arr[i], arr[j]) = (arr[j], arr[i]);
                i++;
                j--;
            }
        }
        if (left < j)
            quickSort(arr, left, j);
        if (i < right)
            quickSort(arr, i, right);
    }
}