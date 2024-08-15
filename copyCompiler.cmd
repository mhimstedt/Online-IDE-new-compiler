del /s /q "C:\Vorhaben\Online-IDE-new-compiler\src\compiler\*"
rmdir /s /q "C:\Vorhaben\Online-IDE-new-compiler\src\compiler"
mkdir "C:\Vorhaben\Online-IDE-new-compiler\src\compiler"
xcopy "C:\Vorhaben\java-compiler\src\compiler" "C:\Vorhaben\Online-IDE-new-compiler\src\compiler" /s /e

del /s /q "C:\Vorhaben\Online-IDE-new-compiler\src\tools\components\treeview\*"
rmdir /s /q "C:\Vorhaben\Online-IDE-new-compiler\src\tools\components\treeview"
mkdir "C:\Vorhaben\Online-IDE-new-compiler\src\tools\components\treeview"
xcopy "C:\Vorhaben\java-compiler\src\tools\components\treeview" "C:\Vorhaben\Online-IDE-new-compiler\src\tools\components\treeview" /s /e

del /s /q "C:\Vorhaben\Online-IDE-new-compiler\documentation\compiler\*"
rmdir /s /q "C:\Vorhaben\Online-IDE-new-compiler\documentation\compiler"
mkdir "C:\Vorhaben\Online-IDE-new-compiler\documentation\compiler"
xcopy "C:\Vorhaben\java-compiler\documentation" "C:\Vorhaben\Online-IDE-new-compiler\documentation\compiler" /s /e

