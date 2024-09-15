# Next steps:

# TODO
  * Test Repository-functionality
  * Test all library classes, add missing methods, fix bugs
  * missing methods:
    * Program must not stop after program end if Timer-object is running (Test-file Timer)
  * In CodeGenerator: use CodeSnippetContainer instead of CodeSnippet[] throughout the code to make inserting nextStepMark() easier and avoid extremely nested CodeSnippetContainers
  * more private fields for graphical objects to get better debugger output
  * 3d-classes
  * add more compiler-tests
  * reading and writing of array elements with ?? operator:
    * read-acces: ((__s[__sb + 3][x]??__t.IOB())[y]??__t.IOB())
    * write-access: ??-operator on all dimensions except the last one
  * School-Settings
    * Vidis-Schulkennung
    * 




# Done:
  * Fix API-documentation 
  * Fix class diagram
  * Make @Test-Annotation work for classes
  * check array indices at runtime
  * create clickable StackTraces and add one to test-summary if exception occurred during test run
  * Implement Test-Runner
  * throw exception if method of already destroyed graphical object is called
  * Test InputManager -> Seems to work...
  * World.scale with given centerX, centerY
  * Shape.bringToFront
  * Shape.sendToBack
  * Color.toInt not working (Test-file Grafik -> Panzer)
  * abstract classes don't work (Test-file Grafik -> A* Pathfinding)
  * missing library methods:
    * World.follow
    * Shape.directionRelativeTo
    * Shape.moveBackFrom
    * Group.renderAsStaticBitmap (Testfile Sternen-Hintergrund)
  * Database classes
  * Test WebSocket classes
  * Serialize object to/from JSON
  * Test and debug homework-functionality
  * Test Pruefung-functionality -> Seems to be ok...
  * Robot class
    

 
