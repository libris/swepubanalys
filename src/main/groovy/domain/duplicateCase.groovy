package domain

import groovy.transform.Canonical

/**
 * Created by Theodor on 2016-06-28.
 */
@Canonical
class DuplicateCase {
    String adjudicationURI
    String id1
    String id2
    boolean isDuplicate
    String comment
    String org1
    String org2
    String userName
    String record1
    String record2
}
