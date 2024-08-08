del /s /q "C:\Vorhaben\Online-IDE-new-compiler\src\compiler\*"
rmdir /s /q "C:\Vorhaben\Online-IDE-new-compiler\src\compiler"
mkdir "C:\Vorhaben\Online-IDE-new-compiler\src\compiler"
xcopy "C:\Vorhaben\java-compiler\src\compiler" "C:\Vorhaben\Online-IDE-new-compiler\src\compiler" /s /e