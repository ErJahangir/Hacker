if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "C:/Users/jahan/.gradle/caches/8.10.2/transforms/8be93bdf47fee54855c5fbf0680faee1/transformed/hermes-android-0.76.5-release/prefab/modules/libhermes/libs/android.armeabi-v7a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/jahan/.gradle/caches/8.10.2/transforms/8be93bdf47fee54855c5fbf0680faee1/transformed/hermes-android-0.76.5-release/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

