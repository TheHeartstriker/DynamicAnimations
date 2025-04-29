cmake_minimum_required(VERSION 3.10)

# Project name
project(DynamicAnimations LANGUAGES CXX)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Check if building with Emscripten
if (EMSCRIPTEN)
    set(CMAKE_EXECUTABLE_SUFFIX ".mjs")
    # Compiler flags
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s USE_SDL=2 -O2")
    # Linker flags
    set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -s ALLOW_MEMORY_GROWTH=1 -s MODULARIZE=1 -s EXPORT_ES6=1 -s EXPORT_NAME='SDLModule' -s ASSERTIONS=1")
endif()

# Source files
set(SOURCES
    main.cpp
    Shapes/Shapes.cpp
    Converge/Converge.cpp
)

# Add executable
add_executable(${PROJECT_NAME} ${SOURCES})

# Include directories (if needed)
target_include_directories(${PROJECT_NAME} PRIVATE Shapes Converge)

# Custom clean target
add_custom_target(custom_clean
    COMMAND ${CMAKE_COMMAND} -E remove ${PROJECT_NAME}${CMAKE_EXECUTABLE_SUFFIX}
    COMMENT "Cleaning up build files"
)